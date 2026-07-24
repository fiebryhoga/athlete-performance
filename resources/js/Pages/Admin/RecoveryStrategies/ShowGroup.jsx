import React from 'react';
import CalendarView from './Partials/CalendarView';

export default function ShowGroup({ group, strategies }) {
    return <CalendarView strategies={strategies} isGroup={true} entity={group} />;
}
