import { Card, CardContent, Typography } from "@mui/material";


export default function TagsTable(props) {
  return (
    <Card sx={{
      maxHeight:100,
      maxWidth:300,
      mt: 4,
      marginLeft:4
    }}>
      <CardContent>
        <Typography component="span"variant="h6" color="black" align={"center"}>
          <strong>{props.tags.auth_user}</strong>
          <div></div> 
          &nbsp; {props.tags.name}
        </Typography>
      </CardContent>
    </Card>

  )
}