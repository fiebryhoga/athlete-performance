import React from 'react';
import CalendarView from './Partials/CalendarView';

export default function ShowAthlete({ athlete, strategies }) {
    return <CalendarView strategies={strategies} isGroup={false} entity={athlete} />;
}
