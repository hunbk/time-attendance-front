import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import styled from '@mui/system/styled';
import { Typography, CardActionArea } from '@mui/material';

const Item = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#262B32' : '#fff',
    padding: theme.spacing(1),
    textAlign: 'center',
    borderRadius: 4,
}));

type WorkGroupCardProps = {
    id: number;
    name: string;
    type: string;
    numOfMembers: number;
    handleSelectedWorkGroupId: (id) => void;
}

const WorkGroupCard: React.FC<WorkGroupCardProps> = ({ id, name, type, numOfMembers, handleSelectedWorkGroupId }) => {
    const [isSelected, setIsSelected] = React.useState(false);

    const handleCardClick = () => {
        setIsSelected((prevSelected) => !prevSelected);
        handleSelectedWorkGroupId(id);
    };

    return (
        <Item>
            <Card
                sx={{
                    backgroundColor: isSelected ? 'lightblue' : 'white',
                    minWidth: 150,
                    maxWidth: 100,
                    minHeight: 100,
                    cursor: 'pointer',
                }} onClick={handleCardClick}>
                <CardActionArea>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            타입: {type}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            인원: {numOfMembers}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Item>);
}

export default WorkGroupCard;