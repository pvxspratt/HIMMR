import { Card, CardContent, Typography } from "@mui/material";


export default function ListingsTable(props) {
  return (
    <Card sx={{
      maxHeight:200,
      maxWidth:400,
      mt: 4,
      marginLeft:4
    }}>
      <CardContent>
        <Typography component="span" variant="h6" color="black" align={"center"}>
          <strong>{props.listing.name}</strong>

          &nbsp; {props.listing.auth_user}
          <div></div> 
          &nbsp; {props.listing.street1}
          <div></div> 
          &nbsp; {props.listing.city}
          <div></div> 
          &nbsp; {props.listing.state}

        </Typography>
      </CardContent>
    </Card>

  )
}