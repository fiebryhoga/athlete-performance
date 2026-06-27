import React from 'react';

import AthleteGrid from './AthleteGrid';
import AnalysisDetail from './AnalysisDetail';

export default function AnalysisTab({ weeklyData, athletes, selectedAthleteId, onSelectAthlete }) {
    
 const isAthlete = athletes.length === 1;
 const effectiveAthleteId = isAthlete ? athletes[0].id : selectedAthleteId;

 // Cari data mingguan si pemain
 const athleteWeeklyInfo = effectiveAthleteId 
 ? weeklyData?.data?.find(p => p.user_id === parseInt(effectiveAthleteId)) 
 : null;

 return (
 <div className="w-full animate-in fade-in duration-300">
 {!effectiveAthleteId || !athleteWeeklyInfo ? (
 // Tampilkan Grid Card
 <AthleteGrid 
 athletes={athletes} 
 weeklyData={weeklyData} 
 onSelectAthlete={onSelectAthlete} 
 />
 ) : (
 // Tampilkan Rincian Detail Data Pemain
 <AnalysisDetail 
 weeklyData={weeklyData}
 athleteWeeklyInfo={athleteWeeklyInfo}
 onBack={isAthlete ? undefined : () => onSelectAthlete('')} 
 />
 )}
 </div>
 );
}