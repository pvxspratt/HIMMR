import { Card, CardContent, Typography } from "@mui/material";


export default function CommentsTable(props) {
  return (
    <Card sx={{
      maxHeight:125,
      maxWidth:600,
      mt: 4,
      marginLeft:4
    }}>
      <CardContent>
        <Typography component="span"variant="h6" color="black" align={"center"}>
          <strong>{props.comment.author}</strong>
          <div></div> 
          &nbsp; {props.comment.body}
        </Typography>
      </CardContent>
    </Card>

  )
}