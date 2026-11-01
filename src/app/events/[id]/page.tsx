import React from 'react';

const EventDetailsPage = async({ params }) => {
    const { id } = params;
    console.log(id);
    return (
        <div>
            Event Details Page
        </div>
    );
};

export default EventDetailsPage;