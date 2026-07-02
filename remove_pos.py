import re

def replace_in_file(filepath, replacements):
    with open(filepath, 'r') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w') as f:
        f.write(content)

# 1. AthleteGrid.jsx
replace_in_file('/Users/mac/Workspace/Work/performance-analysis/athlete-performance/resources/js/Pages/Admin/WellnessRpe/Partials/AthleteGrid.jsx', [
    ('(p.position && p.position.toLowerCase().includes(q)) ||', ''),
    ('placeholder="Search by name, position, or jersey number..."', 'placeholder="Search by athlete name..."'),
    ("{athlete.position || 'Athlete'} {np ? `• #${np}` : ''}", "{np ? `No. ${np}` : 'Athlete'}")
])

# 2. AnalysisDetail.jsx
replace_in_file('/Users/mac/Workspace/Work/performance-analysis/athlete-performance/resources/js/Pages/Admin/WellnessRpe/Partials/AnalysisDetail.jsx', [
    ('                                            <div className="text-[10px] sm:text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full inline-block mb-1">\n                                                {athleteWeeklyInfo.position}\n                                            </div>', '')
])

# 3. WellnessAthleteRow.jsx
replace_in_file('/Users/mac/Workspace/Work/performance-analysis/athlete-performance/resources/js/Pages/Admin/WellnessRpe/Partials/WellnessAthleteRow.jsx', [
    ('                    {athlete.position}', '                    {athlete.gender === "female" ? "Female" : "Male"}'),
    ('                {String(athlete.position_number || 0).padStart(2, "0")}', '                {String(athlete.position_number || index + 1).padStart(2, "0")}')
])

# 4. Show.jsx
replace_in_file('/Users/mac/Workspace/Work/performance-analysis/athlete-performance/resources/js/Pages/Admin/WellnessRpe/Show.jsx', [
    ('<span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-900 shrink-0">{p.position || \'—\'}</span>', '')
])

print("Removed position references.")
