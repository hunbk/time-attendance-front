import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import styled from '@mui/system/styled';
import { Typography, CardActionArea } from '@mui/material';

const Item = styled('div')(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'center',
    borderRadius: 4,
}));

type WorkGroupCardProps = {
    id: number;
    name: string;
    type: string;
    numOfMembers: number;
    isSelected: boolean;
    handleSelectedWorkGroup: (id: number, name: string, type: string, numOfMembers: number) => void;
}

const WorkGroupCard: React.FC<WorkGroupCardProps> = ({ id, name, type, numOfMembers, isSelected, handleSelectedWorkGroup }) => {
    const handleCardClick = () => {
        handleSelectedWorkGroup(id, name, type, numOfMembers);
    };

    return (
        <Item>
            <Card
                sx={{
                    backgroundColor: isSelected ? 'lightblue' : 'white',
                    maxWidth: 170,
                    minWidth: 170,
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