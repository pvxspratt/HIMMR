import os

from django.contrib.auth.hashers import make_password
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.urls import reverse
from django.utils.encoding import force_str, smart_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework import serializers

from .models import *

load_dotenv()


class UserSerializers:
    """
    All serializers for the User Model go here
    """

    class UserRegisterSerializer(serializers.ModelSerializer):
        username = serializers.CharField(max_length=100, required=True)
        password = serializers.CharField(write_only=True, max_length=255, style={'input_type': 'password'},
                                         required=True)
        email = serializers.EmailField(required=True)
        first_name = serializers.CharField(required=False, max_length=255)
        last_name = serializers.CharField(required=False, max_length=255)
        gender = serializers.ChoiceField(
            choices=(('M', 'Male'), ('F', 'Female'), ('NB', 'Non-Binary'), ('NA', 'Not Available')), allow_null=True,
            allow_blank=True, required=False)

        class Meta:
            model = User
            fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password', 'gender']

        def validate(self, attrs):
            if User.objects.exists(username=attrs['username'], email=attrs['email']):
                raise serializers.ValidationError({'error': 'a user with this email or username already exists'})

            return super().validate(attrs)

        def create(self, validated_data):
            return User.objects.create_user(**validated_data)

    class UserLoginSerializer(serializers.ModelSerializer):
        username = serializers.CharField(max_length=100, required=True)
        password = serializers.CharField(write_only=True, max_length=255, style={'input_type': 'password'},
                                         required=True)

        class Meta:
            model = User
            fields = ['username', 'password']

        def validate(self, attrs):
            if not User.objects.filter(username=attrs['username']).exists():
                raise serializers.ValidationError({'error': 'user does not exist'})
            else:
                check_user = User.objects.get(username=attrs['username'])
                if not check_user.check_password(attrs['password']):
                    raise serializers.ValidationError({'error': 'invalid credentials'})

            return super().validate(attrs)

    class UserDetailSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_created', 'is_active']

        def validate(self, attrs):
            pass

    class UserUpdatePasswordSerializer(serializers.ModelSerializer):
        new_password = serializers.CharField(write_only=True, max_length=255,
                                             style={'input_type': 'password'},
                                             required=True)
        token = serializers.CharField(write_only=True)
        uid = serializers.CharField(write_only=True)
        email = serializers.CharField(read_only=True)
        username = serializers.CharField(read_only=True)

        class Meta:
            model = User
            fields = ['username', 'email', 'new_password', 'token', 'uid']

        def validate(self, attrs):
            uid_decoded = force_str(urlsafe_base64_decode(attrs['uid']))
            if not User.objects.filter(id=uid_decoded).exists():
                raise serializers.ValidationError({'error': 'user does not exist'})

            user = User.objects.get(id=uid_decoded)
            if not PasswordResetTokenGenerator().check_token(token=attrs['token'], user=user):
                raise serializers.ValidationError({'error': 'token is invalid, try again'})
            return super().validate(attrs)

        def create(self, validated_data):
            uid_decoded = force_str(urlsafe_base64_decode(validated_data['uid']))
            user_to_update = User.objects.get(id=uid_decoded)
            user_to_update.password = make_password(password=validated_data['new_password'])
            user_to_update.save()
            return user_to_update

    class UserForgotPasswordSerializer(serializers.ModelSerializer):
        email = serializers.EmailField(required=True)

        class Meta:
            model = User
            fields = ['email']

        def validate(self, attrs):
            if not User.objects.exists(email=attrs['email']):
                raise serializers.ValidationError({'error': 'user does not exist'})

            user = User.objects.get(email=attrs['email'])
            uid_b64 = urlsafe_base64_encode(smart_bytes(user.id))
            pwd_reset_token = PasswordResetTokenGenerator().make_token(user)

            # cdomain = get_current_site(self.context['request'])
            protocol = self.context['protocol']
            rel_link = reverse(viewname="forgot_password_reset", kwargs={'uid': uid_b64, 'token': pwd_reset_token})
            # curl = f'{protocol}://{domain}{rel_link}'

            domain = 'himmr-1.web.app' if protocol == 'https' else 'localhost:3000'
            url = f'{protocol}://{domain}/uid={uid_b64}/token={pwd_reset_token}'

            try:
                send_mail(
                    subject='HIMMR Password Reset',
                    message=f'Hello {user.email},\nClick on {url} to reset your password.',
                    from_email=os.getenv('HIMMR_EMAIL_ID'),
                    recipient_list=[user.email],
                )
            except Exception as e:
                raise e
            return super().validate(attrs)


class ProfileSerializers:
    """
        All serializers for the Profile Model go here
    """

    class ProfileListSerializer(serializers.ModelSerializer):
        tags = serializers.SlugRelatedField(many=True, read_only=True, slug_field='name')
        auth_user = serializers.SlugRelatedField(many=False, read_only=True, slug_field='username')
        first_name = serializers.SerializerMethodField(method_name='get_first_name')
        last_name = serializers.SerializerMethodField(method_name='get_last_name')
        matches = serializers.SerializerMethodField(method_name='get_matches')
        blocked_users = serializers.SerializerMethodField(method_name='get_blocked_users')

        class Meta:
            model = Profile
            fields = ['id', 'auth_user', 'first_name', 'last_name', 'bio', 'tags', 'picture', 'matches',
                      'blocked_users']

        def get_matches(self, instance):
            return [match.auth_user.username for match in instance.matches.all()]

        def get_blocked_users(self, instance):
            return [blocked_user.auth_user.username for blocked_user in instance.blocked_users.all()]

        def get_first_name(self, instance):
            return instance.auth_user.first_name if instance.auth_user.first_name else None

        def get_last_name(self, instance):
            return instance.auth_user.last_name if instance.auth_user.first_name else None

    class ProfileUpdateSerializer(serializers.ModelSerializer):
        auth_user = serializers.SlugRelatedField(many=False, read_only=True, slug_field='username')
        first_name = serializers.CharField(required=False, max_length=255)
        last_name = serializers.CharField(required=False, max_length=255)
        bio = serializers.CharField(required=False, max_length=500)
        picture = serializers.CharField(required=False, max_length=500)

        class Meta:
            model = Profile
            fields = ['id', 'auth_user', 'first_name', 'last_name', 'bio', 'picture']

        def validate(self, attrs):
            return super().validate(attrs)

        def create(self, validated_data):

            user_profile = self.context['request'].user.profile

            if 'bio' in validated_data:
                user_profile.bio = validated_data['bio']
            if 'first_name' in validated_data:
                user_profile.auth_user.first_name = validated_data['first_name']
            if 'last_name' in validated_data:
                user_profile.auth_user.last_name = validated_data['last_name']
            if 'picture' in validated_data:
                user_profile.picture = validated_data['picture']

            user_profile.save()
            return user_profile


class RequestSerializers:
    """
    All serializers for the Profile requests go here
    """

    class MatchRequestListSerializer(serializers.ModelSerializer):
        sent = serializers.SerializerMethodField(method_name='get_sent_requests')
        received = serializers.SerializerMethodField(method_name='get_received_requests')
        username = serializers.SerializerMethodField(method_name='get_username')

        class Meta:
            model = MatchRequest
            fields = ['username', 'sent', 'received']

        def get_username(self, instance):
            return self.context['request'].user.username

        def get_sent_requests(self, instance):
            user_profile = self.context['request'].user.profile
            return [match_req.match_receiver.auth_user.username for match_req in
                    MatchRequest.objects.filter(match_sender=user_profile)]

        def get_received_requests(self, instance):
            user_profile = self.context['request'].user.profile
            return [match_req.match_sender.auth_user.username for match_req in
                    MatchRequest.objects.filter(match_receiver=user_profile)]

    class MatchRequestPostSerializer(serializers.ModelSerializer):
        match_receiver = serializers.CharField(max_length=100, required=True)

        class Meta:
            model = MatchRequest
            fields = ['match_receiver']

        def validate(self, attrs):
            if not User.objects.exists(username=attrs['match_receiver']):
                raise serializers.ValidationError({'error': 'user does not exist'})

            match_receiver_profile = User.objects.get(username=attrs['match_receiver']).profile
            match_sender_profile = self.context['request'].user.profile

            if MatchRequest.objects.filter(match_sender=match_sender_profile,
                                           match_receiver=match_receiver_profile).exists():
                raise serializers.ValidationError({'error': 'match request already sent'})

            return super().validate(attrs)

        def create(self, validated_data):
            match_receiver_profile = User.objects.get(username=validated_data['match_receiver']).profile
            match_sender_profile = self.context['request'].user.profile

            new_match_request = MatchRequest.objects.create(match_sender=match_sender_profile,
                                                            match_receiver=match_receiver_profile)
            Notification.objects.create(for_user=match_receiver_profile, from_user=match_sender_profile, type='CR',
                                        object_id=match_sender_profile.auth_user.username,
                                        message=f'{match_sender_profile.auth_user.username} wants to connect!',
                                        read=False)

            new_match_request.save()

            if MatchRequest.objects.filter(match_sender=match_receiver_profile,
                                           match_receiver=match_sender_profile).exists():
                Profile.add_new_match(match_sender_profile, match_receiver_profile)
                Notification.objects.create(for_user=match_receiver_profile, from_user=match_sender_profile, type='CRA',
                                            object_id=match_sender_profile.auth_user.username,
                                            message=f'{match_sender_profile.auth_user.username} '
                                                    f'is now your connection!',
                                            read=False)
                Notification.objects.create(for_user=match_sender_profile, from_user=match_receiver_profile, type='CRA',
                                            object_id=match_receiver_profile.auth_user.username,
                                            message=f'{match_receiver_profile.auth_user.username} '
                                                    f'is now your connection!',
                                            read=False)

            return new_match_request

    class BlockRequestPostSerializer(serializers.ModelSerializer):
        block_receiver = serializers.CharField(max_length=100, required=True)

        class Meta:
            model = MatchRequest
            fields = ['block_receiver']

        def validate(self, attrs):
            if not User.objects.exists(username=attrs['block_receiver']):
                raise serializers.ValidationError({'error': 'user does not exist'})

            block_sender_profile = self.context['request'].user.profile
            block_receiver_profile = User.objects.get(username=attrs['block_receiver']).profile

            if BlockRequest.objects.filter(block_sender=block_sender_profile,
                                           block_receiver=block_receiver_profile).exists():
                raise serializers.ValidationError({'error': 'block request already sent'})

            return super().validate(attrs)

        def create(self, validated_data):
            block_receiver_profile = User.objects.get(username=validated_data['block_receiver']).profile
            block_sender_profile = self.context['request'].user.profile

            return Profile.block_profile(block_sender_profile=block_sender_profile,
                                         block_receiver_profile=block_receiver_profile)


class TagSerializers:
    """
        All serializers for the Tag Model go here
    """

    class TagListSerializer(serializers.ModelSerializer):
        auth_user = serializers.SerializerMethodField(method_name='get_auth_user')

        class Meta:
            model = Tag
            fields = ['id', 'auth_user', 'name']

        def get_auth_user(self, instance):
            return instance.profile.auth_user.username

    class TagCreateSerializer(serializers.Serializer):

        names = serializers.CharField(max_length=30)

        def validate(self, attrs):
            username = self.context['request'].user.username
            if not User.objects.exists(username=username):
                raise serializers.ValidationError({'error': 'user does not exist'})
            return super().validate(attrs)

        def create(self, validated_data):
            auth_user = self.context['request'].user
            for name in validated_data['names']:
                t = Tag.objects.create(name=name.lower(), profile=auth_user.profile)
                t.save()
            return validated_data

        def to_internal_value(self, data):
            return data

        def to_representation(self, instance):
            return instance


class PostSerializers:
    """
           All serializers for Posts  go here
       """

    class PostListSerializer(serializers.ModelSerializer):
        author = serializers.SerializerMethodField(method_name='get_post_author')
        likes_count = serializers.SerializerMethodField(method_name='get_like_count')
        liked_by = serializers.SerializerMethodField(method_name='get_liked_by')
        comment_ids = serializers.SerializerMethodField(method_name='get_comment_ids')

        class Meta:
            model = Post
            fields = ['id', 'author', 'title', 'body', 'image', 'likes_count', 'liked_by', 'comment_ids',
                      'published_on']

        def get_post_author(self, instance):
            return instance.author.auth_user.username

        def get_like_count(self, instance):
            return instance.post_likes.count()

        def get_liked_by(self, instance):
            return [like.related_profile.auth_user.username for like in instance.post_likes.all()]

        def get_comment_ids(self, instance):
            return [comment.id for comment in instance.comments.all()]

    class PostCreateSerializer(serializers.ModelSerializer):
        title = serializers.CharField(max_length=250, required=True)
        body = serializers.CharField(max_length=500, required=False)
        image = serializers.CharField(required=False, max_length=500)
        published_on = serializers.DateTimeField(required=False)

        author = serializers.SerializerMethodField(method_name='get_post_author')
        likes_count = serializers.SerializerMethodField(method_name='get_like_count')
        liked_by = serializers.SerializerMethodField(method_name='get_liked_by')

        class Meta:
            model = Post
            fields = ['id', 'author', 'title', 'body', 'image', 'likes_count', 'liked_by', 'published_on']

        def get_post_author(self, instance):
            return instance.author.auth_user.username

        def get_like_count(self, instance):
            return instance.post_likes.count()

        def get_liked_by(self, instance):
            return [like.related_profile.auth_user.username for like in instance.post_likes.all()]

        def validate(self, attrs):
            return super().validate(attrs)

        def create(self, validated_data):
            validated_data['author'] = self.context['request'].user.profile
            new_post = Post.objects.create(**validated_data)
            new_post.save()
            return new_post

    class PostUpdateSerializer(serializers.ModelSerializer):

        id = serializers.IntegerField(required=True)

        title = serializers.CharField(max_length=250, required=False)
        body = serializers.CharField(max_length=500, required=False)
        image = serializers.CharField(required=False, max_length=500)
        liker = serializers.CharField(max_length=100, required=False)
        published_on = serializers.DateTimeField(required=False)

        author = serializers.SerializerMethodField(method_name='get_post_author')
        likes_count = serializers.SerializerMethodField(method_name='get_like_count')
        liked_by = serializers.SerializerMethodField(method_name='get_liked_by')
        comment_ids = serializers.SerializerMethodField(method_name='get_comment_ids')

        class Meta:
            model = Post
            fields = ['id', 'author', 'title', 'body', 'image', 'likes_count', 'liked_by', 'liker', 'comment_ids',
                      'published_on']

        def get_post_author(self, instance):
            return instance.author.auth_user.username

        def get_like_count(self, instance):
            return instance.post_likes.count()

        def get_liked_by(self, instance):
            return [like.related_profile.auth_user.username for like in instance.post_likes.all()]

        def get_comment_ids(self, instance):
            return [comment.id for comment in instance.comments.all()]

        def validate(self, attrs):
            return super().validate(attrs)

        def create(self, validated_data):
            post_to_update = Post.objects.get(id=validated_data['id'])
            req_user_profile = self.context['request'].user.profile
            if 'liker' in validated_data:
                liker_profile = User.objects.get(username=validated_data['liker']).profile

                prev_liked_by = set(post_like.related_profile.auth_user.username for post_like in
                                    post_to_update.post_likes.all())
                # Post has been unliked
                if validated_data['liker'] in prev_liked_by:
                    old_like = Like.objects.get(related_profile=liker_profile, post=post_to_update)
                    post_to_update.post_likes.remove(old_like)
                    old_like.delete()
                else:
                    new_like = Like.objects.create(related_profile=liker_profile, post=post_to_update)
                    post_to_update.post_likes.add(new_like)
                    Notification.objects.create(for_user=post_to_update.author, from_user=liker_profile, type='P',
                                                message=f'{liker_profile.auth_user.username} just liked your post!',
                                                object_id=str(post_to_update.id),
                                                read=False)

            err = {'error': 'you do not have permission to update this post'}
            if 'title' in validated_data:
                if req_user_profile != post_to_update.author:
                    raise serializers.ValidationError(err)
                post_to_update.title = validated_data['title']

            if 'body' in validated_data:
                if req_user_profile != post_to_update.author:
                    raise serializers.ValidationError(err)
                post_to_update.body = validated_data['body']

            if 'image' in validated_data:
                if req_user_profile != post_to_update.author:
                    raise serializers.ValidationError(err)
                post_to_update.image = validated_data['image']

            post_to_update.save()
            return post_to_update


class CommentSerializers:
    class CommentListSerializer(serializers.ModelSerializer):
        author = serializers.SerializerMethodField(method_name='get_comment_author')
        likes_count = serializers.SerializerMethodField(method_name='get_like_count')
        liked_by = serializers.SerializerMethodField(method_name='get_liked_by')
        reply_comment_id = serializers.SerializerMethodField(method_name='get_reply_ids')

        class Meta:
            model = Comment
            fields = ['id', 'author', 'body', 'likes_count', 'liked_by', 'reply_comment_id', 'published_on']

        def get_comment_author(self, instance):
            return instance.author.auth_user.username

        def get_like_count(self, instance):
            return instance.comment_likes.count()

        def get_liked_by(self, instance):
            return [like.related_profile.auth_user.username for like in instance.comment_likes.all()]

        def get_reply_ids(self, instance):
            return [reply.id for reply in instance.replies.all()]

    class CommentCreateSerializer(serializers.ModelSerializer):
        post_id = serializers.IntegerField(required=False)
        comment_id = serializers.IntegerField(required=False)
        body = serializers.CharField(max_length=500, required=False)
        published_on = serializers.DateTimeField(required=False)

        author = serializers.SerializerMethodField(method_name='get_comment_author')
        likes_count = serializers.SerializerMethodField(method_name='get_like_count')
        liked_by = serializers.SerializerMethodField(method_name='get_liked_by')

        class Meta:
            model = Comment
            fields = ['id', 'author', 'body', 'likes_count', 'liked_by', 'published_on', 'post_id', 'comment_id']

        def get_comment_author(self, instance):
            return instance.author.auth_user.username

        def get_like_count(self, instance):
            return instance.comment_likes.count()

        def get_liked_by(self, instance):
            return [like.related_profile.auth_user.username for like in instance.comment_likes.all()]

        def validate(self, attrs):
            if 'comment_id' not in attrs and 'post_id' not in attrs:
                raise serializers.ValidationError({'error': 'either the comment_id or post_id must be given'})
            return super().validate(attrs)

        def create(self, validated_data):
            validated_data['author'] = self.context['request'].user.profile
            if 'post_id' in validated_data:
                validated_data['post'] = Post.objects.get(id=validated_data['post_id'])
                if validated_data['post'].author != validated_data['author']:
                    Notification.objects.create(for_user=validated_data['post'].author,
                                                from_user=validated_data['author'],
                                                type='P',
                                                object_id=str(validated_data['post'].id),
                                                message=f'{validated_data["author"].auth_user.username} '
                                                        f'commented on your post!',
                                                read=False)
                return Comment.objects.create(**validated_data)
            else:
                related_comment = Comment.objects.get(id=validated_data['comment_id'])
                del validated_data['comment_id']
                new_comment = Comment.objects.create(**validated_data)
                related_comment.replies.add(new_comment)
                if related_comment.author != validated_data['author']:
                    Notification.objects.create(for_user=validated_data['post'].author,
                                                from_user=validated_data['author'],
                                                type='P',
                                                object_id=str(validated_data['post'].id),
                                                message=f'{validated_data["author"].auth_user.username} '
                                                        f'commented on your post!',
                                                read=False)
                return new_comment

    class CommentUpdateSerializer(serializers.ModelSerializer):
        id = serializers.IntegerField(required=True)
        body = serializers.CharField(max_length=500, required=False)
        liker = serializers.CharField(max_length=100, required=False)
        published_on = serializers.DateTimeField(required=False)

        author = serializers.SerializerMethodField(method_name='get_comment_author')
        likes_count = serializers.SerializerMethodField(method_name='get_like_count')
        liked_by = serializers.SerializerMethodField(method_name='get_liked_by')

        class Meta:
            model = Comment
            fields = ['id', 'author', 'body', 'likes_count', 'liked_by', 'published_on', 'liker']

        def get_comment_author(self, instance):
            return instance.author.auth_user.username

        def get_like_count(self, instance):
            return instance.comment_likes.count()

        def get_liked_by(self, instance):
            return [like.related_profile.auth_user.username for like in instance.comment_likes.all()]

        def validate(self, attrs):
            if 'id' not in attrs:
                raise serializers.ValidationError({'error': 'comment_id must be given'})
            return super().validate(attrs)

        def create(self, validated_data):
            comment_to_update = Comment.objects.get(id=validated_data['id'])
            req_user_profile = self.context['request'].user.profile
            if 'liker' in validated_data:
                liker_profile = User.objects.get(username=validated_data['liker']).profile

                prev_liked_by = set(comment_like.related_profile.auth_user.username for comment_like in
                                    comment_to_update.comment_likes.all())
                # Post has been unliked
                if validated_data['liker'] in prev_liked_by:
                    old_like = Like.objects.get(related_profile=liker_profile, comment=comment_to_update)
                    comment_to_update.comment_likes.remove(old_like)
                    old_like.delete()
                else:
                    new_like = Like.objects.create(related_profile=liker_profile, comment=comment_to_update)
                    comment_to_update.comment_likes.add(new_like)
                    if req_user_profile != liker_profile:
                        Notification.objects.create(for_user=comment_to_update.author, from_user=liker_profile,
                                                    type='P',
                                                    object_id=str(comment_to_update.post.id),
                                                    message=f'{liker_profile.auth_user.username} just liked a comment '
                                                            f'on your post!',
                                                    read=False)

            if 'body' in validated_data:
                if req_user_profile != comment_to_update.author:
                    raise serializers.ValidationError({'error': 'you do not have permission to update this comment'})
                comment_to_update.body = validated_data['body']

            comment_to_update.save()
            return comment_to_update


class ListingSerializers:
    class ListingGetSerializer(serializers.ModelSerializer):
        username = serializers.SerializerMethodField(method_name='get_username')
        street1 = serializers.CharField(max_length=250, required=False)
        street2 = serializers.CharField(max_length=250, required=False)
        city = serializers.CharField(max_length=100, required=False)
        state = serializers.CharField(max_length=100, required=False)
        country = serializers.CharField(max_length=100, required=False)
        zipcode = serializers.CharField(max_length=100, required=False)
        name = serializers.CharField(max_length=100, required=False)
        open = serializers.BooleanField(required=False)
        image = serializers.CharField(required=False, max_length=500)

        class Meta:
            model = Listing
            fields = ['id', 'name', 'username', 'open', 'street1', 'street2', 'city', 'state', 'country', 'zipcode',
                      'image']

        def get_username(self, instance):
            return instance.profile.auth_user.username

    class ListingPostSerializer(serializers.ModelSerializer):
        username = serializers.SerializerMethodField(method_name='get_username')
        street1 = serializers.CharField(max_length=250, required=False)
        street2 = serializers.CharField(max_length=250, required=False)
        city = serializers.CharField(max_length=100, required=False)
        state = serializers.CharField(max_length=100, required=False)
        country = serializers.CharField(max_length=100, required=False)
        zipcode = serializers.CharField(max_length=100, required=False)
        name = serializers.CharField(max_length=100, required=False)
        open = serializers.BooleanField(required=False)
        image = serializers.CharField(required=False, max_length=500)

        class Meta:
            model = Listing
            fields = ['id', 'name', 'username', 'open', 'street1', 'street2', 'city', 'state', 'country', 'zipcode',
                      'image']

        def get_username(self, instance):
            return self.context['request'].user.username

        def validate(self, attrs):
            return super().validate(attrs)

        def create(self, validated_data):
            validated_data['profile'] = self.context['request'].user.profile
            listing = Listing.objects.create(**validated_data)
            listing.save()
            return listing

    class ListingUpdateSerializer(serializers.ModelSerializer):
        username = serializers.SerializerMethodField(method_name='get_username')
        street1 = serializers.CharField(max_length=250, required=False)
        street2 = serializers.CharField(max_length=250, required=False)
        city = serializers.CharField(max_length=100, required=False)
        state = serializers.CharField(max_length=100, required=False)
        country = serializers.CharField(max_length=100, required=False)
        zipcode = serializers.CharField(max_length=100, required=False)
        name = serializers.CharField(max_length=100, required=False)
        open = serializers.BooleanField(required=False)
        image = serializers.ImageField(required=False)
        id = serializers.IntegerField(required=True)

        class Meta:
            model = Listing
            fields = ['id', 'name', 'username', 'open', 'street1', 'street2', 'city', 'state', 'country', 'zipcode',
                      'image']

        def get_username(self, instance):
            return self.context['request'].user.username

        def validate(self, attrs):
            if 'id' not in attrs:
                raise serializers.ValidationError({'error': 'the listing id is missing'})
            return super().validate(attrs)

        def create(self, validated_data):
            listing_to_update = Listing.objects.get(id=validated_data['id'])
            if 'open' in validated_data:
                listing_to_update.open = validated_data['open']
            listing_to_update.save()
            return listing_to_update


class NotificationSerializers:
    class NotificationGetSerializer(serializers.ModelSerializer):
        from_user = serializers.SerializerMethodField(method_name='get_from_user')

        class Meta:
            model = Notification
            fields = ['id', 'object_id', 'read', 'from_user', 'message', 'timestamp', 'type']

        def get_from_user(self, instance):
            return instance.from_user.auth_user.username
