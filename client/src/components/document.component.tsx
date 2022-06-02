import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

export interface DocumentProps {
  id: number;
  title: string;
  description: string;
  clickHandler: (id: number) => void;
}

export const Document = (props: DocumentProps) => {
  const { clickHandler, id, title, description } = props;

  return (
    <Card sx={{ maxWidth: 345, marginLeft: 'auto', marginRight: 'auto' }}>
      <CardActionArea onClick={() => clickHandler(id)}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            { title }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            { description }
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
