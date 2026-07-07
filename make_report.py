import re

with open('resources/views/exports/training_session_pdf.blade.php', 'r') as f:
    content = f.read()

# Replace body content
body_match = re.search(r'<body>(.*?)</body>', content, re.DOTALL)
if body_match:
    body_content = body_match.group(1)
    
    # Wrap in foreach
    new_body = "\n    @foreach($trainings as $training)\n" + body_content
    
    # Adjust athlete actuals
    # In training_session_pdf, we have:
    # @if(isset($athletesData) && count($athletesData) > 0)
    # ...
    # @foreach($athletesData as $index => $atData)
    
    new_body = new_body.replace('$athletesData', '[$training->athleteData]')
    new_body = new_body.replace('isset([$training->athleteData]) && count([$training->athleteData]) > 0', 'isset($training->athleteData)')
    
    # Add page break at the end of each training if not last
    new_body += "\n        @if(!$loop->last)\n            <div style=\"page-break-after: always;\"></div>\n        @endif\n"
    new_body += "    @endforeach\n"
    
    # Put back into html
    new_content = content[:body_match.start(1)] + new_body + content[body_match.end(1):]
    
    with open('resources/views/exports/athlete_session_report_pdf.blade.php', 'w') as out:
        out.write(new_content)
        
    print("Created athlete_session_report_pdf.blade.php")
else:
    print("Could not find body tag")
