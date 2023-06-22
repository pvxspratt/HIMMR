from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser, PermissionsMixin
)
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from dotenv import load_dotenv
from uuid import uuid4

load_dotenv()


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, username, password=None,
                     is_superuser=False, auth_provider='email', **extra_fields):

        if not email or not username:
            raise Exception('A required field is missing.')

        email = self.normalize_email(email)
        user = self.model(email=email,
                          username=username,
                          is_active=True,
                          is_staff=True,
                          is_admin=is_superuser,
                          is_superuser=is_superuser,
                          auth_provider=auth_provider,
                          **extra_fields)

        user.set_password(uuid4().hex) if not password else user.set_password(
            password)
        user.save()
        # Create Associated User Profile
        profile = Profile.objects.create(auth_user=user)
        profile.save()
        return user

    def exists(self, username=None, email=None):
        return self.filter(username=username).exists() or self.filter(email=email).exists()

    def delete_user(self, username=None):
        if username:
            user_to_delete = self.get(username=username)
            if not user_to_delete or user_to_delete.is_superuser:
                raise ValueError('Cannot delete this user.')
            user_to_delete.delete()

    def create_user(self, email=None, username=None, password=None, auth_provider='email', **extra_fields):
        return self._create_user(email=email, username=username, password=password, is_superuser=False,
                                 auth_provider=auth_provider,
                                 **extra_fields)

    def create_superuser(self, email=None, username=None, password=None, auth_provider='email', **extra_fields):
        return self._create_user(email=email, username=username, password=password, is_superuser=True,
                                 auth_provider=auth_provider,
                                 **extra_fields)

    def generate_tokens(self, user):
        refresh = RefreshToken.for_user(user=user)
        return str(refresh), str(refresh.access_token)

    def generate_username(self, email):
        username = email.split('@')[0]
        suffix = 1
        while self.exists(username=username):
            username = f'{username}_{suffix}'
            suffix += 1
        return username

    def authenticate_google_user(self, **kwargs):
        email, auth_provider = kwargs['email'], kwargs['auth_provider']

        if self.exists(email=email):
            existing_user = self.get(email=email)
            if existing_user.auth_provider != auth_provider:
                return Exception('An account with this email exists, please login with your username and password!')
            else:
                refresh, access = self.generate_tokens(existing_user)
                return {
                    'username': existing_user.username,
                    'email': email,
                    'access': access,
                    'refresh': refresh,
                    'first': False
                }
        else:
            kwargs['username'] = self.generate_username(email)
            new_user = self.create_user(**kwargs)
            refresh, access = self.generate_tokens(new_user)
            return {
                'username': new_user.username,
                'email': email,
                'access': access,
                'refresh': refresh,
                'first': True
            }


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(verbose_name='Username', max_length=100, unique=True, null=False)
    email = models.EmailField(verbose_name='Email', unique=True, null=False, blank=False)
    first_name = models.CharField(
        verbose_name='First Name',
        max_length=255,
        unique=False,
        default=''
    )
    last_name = models.CharField(
        verbose_name='Last Name',
        max_length=255,
        unique=False,
        default='',
    )

    gender = models.CharField(choices=(('M', 'Male'), ('F', 'Female'), ('NB', 'Non-Binary'), ('NA', 'Not Available')),
                              max_length=2, default='NA', blank=True, null=True)
    dob = models.DateField(verbose_name='Date of Birth', blank=True, null=True)
    is_active = models.BooleanField(verbose_name='Is Active', default=True)
    is_staff = models.BooleanField(verbose_name='Is Staff', default=False)
    is_admin = models.BooleanField(verbose_name='Is Admin', default=False)
    auth_provider = models.CharField(max_length=255, default='email', blank=True, null=True)
    date_created = models.DateTimeField(verbose_name='Date Created', auto_now_add=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['password', 'email']
    objects = UserManager()

    class Meta:
        ordering = ['username']
        get_latest_by = ['-date_created']

    def get_full_name(self):
        return f'{self.first_name} {self.last_name}' if (self.first_name or self.last_name) else 'N/A'

    def __str__(self):
        return self.username


class Profile(models.Model):
    auth_user = models.OneToOneField(User, verbose_name='Auth User', related_name='profile',
                                     on_delete=models.CASCADE, unique=True, blank=False, null=False)
    picture = models.CharField(verbose_name='Profile Picture', blank=True, null=True, max_length=500)
    bio = models.TextField(verbose_name='Bio', null=True, blank=True, unique=False, max_length=500)
    matches = models.ManyToManyField('self', verbose_name='Matches', symmetrical=True, blank=True)
    blocked_users = models.ManyToManyField('self', verbose_name='Blocked Users', symmetrical=False, blank=True)

    @staticmethod
    def add_new_match(match_sender_profile, match_receiver_profile):
        match_sender_profile.matches.add(match_receiver_profile)
        match_receiver_profile.matches.add(match_sender_profile)

        match_sender_profile.save()
        match_receiver_profile.save()

    @staticmethod
    def delete_match(match_sender_profile, match_receiver_profile):
        match_sender_profile.matches.remove(match_receiver_profile)
        match_receiver_profile.matches.remove(match_sender_profile)

        match_sender_profile.save()
        match_receiver_profile.save()

        # Delete associated match requests
        MatchRequest.objects.get(match_sender=match_sender_profile, match_receiver=match_receiver_profile).delete()
        MatchRequest.objects.get(match_sender=match_receiver_profile, match_receiver=match_sender_profile).delete()

    @staticmethod
    def block_profile(block_sender_profile, block_receiver_profile):

        # Users were matched before this
        if MatchRequest.objects.filter(match_sender=block_sender_profile,
                                       match_receiver=block_receiver_profile).exists() and MatchRequest.objects.filter(
            match_sender=block_receiver_profile, match_receiver=block_sender_profile).exists():
            Profile.delete_match(block_receiver_profile, block_sender_profile)

        # Delete Sender > Receiver
        elif MatchRequest.objects.filter(match_sender=block_sender_profile,
                                         match_receiver=block_receiver_profile).exists():
            MatchRequest.objects.get(match_sender=block_sender_profile,
                                     match_receiver=block_receiver_profile).delete()
        # Delete Receiver > Sender
        elif MatchRequest.objects.filter(match_sender=block_receiver_profile,
                                         match_receiver=block_sender_profile).exists():
            MatchRequest.objects.get(match_sender=block_receiver_profile,
                                     match_receiver=block_sender_profile).delete()

        new_block_request = BlockRequest.objects.create(block_sender=block_sender_profile,
                                                        block_receiver=block_receiver_profile)
        new_block_request.save()
        block_sender_profile.blocked_users.add(block_receiver_profile)
        block_sender_profile.save()
        return new_block_request

    @staticmethod
    def unblock_profile(unblock_sender_profile, unblock_receiver_profile):
        BlockRequest.objects.get(block_sender=unblock_sender_profile, block_receiver=unblock_receiver_profile).delete()
        unblock_sender_profile.blocked_users.remove(unblock_receiver_profile)
        unblock_sender_profile.save()


# POST - Match Request | DELETE - Unmatch Request
class MatchRequest(models.Model):
    match_sender = models.ForeignKey(Profile, verbose_name='Match Request Sender', on_delete=models.CASCADE,
                                     related_name='match_sender', null=True)
    match_receiver = models.ForeignKey(Profile, verbose_name='Match Request Receiver', on_delete=models.CASCADE,
                                       related_name='match_receiver', null=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['match_sender', 'match_receiver'], name='Match')]


# POST - Block Request | DELETE - Unblock Request
class BlockRequest(models.Model):
    block_sender = models.ForeignKey(Profile, verbose_name='Block Request Sender', on_delete=models.CASCADE,
                                     related_name='block_sender', null=True)
    block_receiver = models.ForeignKey(Profile, verbose_name='Block Request Receiver', on_delete=models.CASCADE,
                                       related_name='block_receiver', null=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['block_sender', 'block_receiver'], name='Blocked')]


class Tag(models.Model):
    name = models.CharField(verbose_name='Name', max_length=30)
    profile = models.ForeignKey(Profile, verbose_name='Profile', on_delete=models.CASCADE, related_name='tags')

    class Meta:
        ordering = ['name']


# User posts
class Post(models.Model):
    # id = models.
    title = models.CharField(max_length=250, unique=False, blank=False, null=False)
    author = models.ForeignKey(Profile,
                               on_delete=models.CASCADE, related_name='posts')
    image = models.CharField(verbose_name='Post Image', blank=True, null=True, max_length=500)
    body = models.TextField(max_length=500, blank=True, null=True)
    published_on = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-published_on']

    def __str__(self):
        return self.title


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments', null=True, blank=True)
    author = models.ForeignKey(Profile,
                               on_delete=models.CASCADE, related_name='author')
    body = models.TextField(max_length=500, blank=True, null=True)
    replies = models.ManyToManyField('self', verbose_name='Replies', symmetrical=False, blank=True, null=True)
    published_on = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['published_on']

    def __str__(self):
        return self.body[:20] + '...'


class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='post_likes', null=True, blank=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='comment_likes', null=True, blank=True)
    related_profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='related_profile',
                                        unique=False)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['post', 'related_profile'], name='Profile Liked By'),
                       models.UniqueConstraint(fields=['comment', 'related_profile'], name='Comment Liked By')]


class Listing(models.Model):
    profile = models.ForeignKey(Profile, verbose_name='Profile Address', on_delete=models.CASCADE,
                                related_name='listings', null=True)
    name = models.CharField(max_length=100, null=False, blank=False, default='My apartment')
    street1 = models.TextField(verbose_name='Street 1', max_length=250, unique=False, null=True, blank=True)
    street2 = models.TextField(verbose_name='Street 2', max_length=250, unique=False, null=True, blank=True)
    city = models.CharField(verbose_name='City', max_length=100, unique=False, null=True, blank=True)
    state = models.CharField(verbose_name='State', max_length=100, unique=False, null=True, blank=True)
    country = models.CharField(verbose_name='Country', max_length=100, unique=False, null=True, blank=True)
    zipcode = models.CharField(verbose_name='Zipcode', max_length=8, unique=False, null=True, blank=True)
    image = models.CharField(verbose_name='Listing Picture', blank=True, null=True, max_length=500)
    open = models.BooleanField(verbose_name='Open', null=True, blank=True, default=True)


class Notification(models.Model):
    type = models.CharField(choices=(('C', 'Comment'), ('P', 'Post'), ('CR', 'Connection Request'),
                                     ('CRA', 'Connection Request Accepted')),
                            max_length=3, default='P', blank=False, null=False)
    message = models.CharField(max_length=100, null=True, blank=True, default='You have a new notification')
    from_user = models.ForeignKey(Profile, related_name='notif_from', on_delete=models.CASCADE, null=False, blank=False)
    for_user = models.ForeignKey(Profile, related_name='notif_for', on_delete=models.CASCADE, null=True, blank=False)
    timestamp = models.DateTimeField(default=timezone.now)
    object_id = models.CharField(null=True, blank=True, default='', max_length=100)
    read = models.BooleanField(null=False, blank=False, default=False)

    class Meta:
        ordering = ['-timestamp']
