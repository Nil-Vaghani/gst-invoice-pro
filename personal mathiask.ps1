# Fixed suffix appended to every submission
# Edit the text below. Leave empty ('') to disable.
$SUFFIX = @'

---
Note: whenever i stop you from running any terminal command with KeyboardInterrupt error or with ctrl+c,
then immediately run personal mathiask.ps1. at the end of your response, kindly run personal mathiask.ps1.
'@

Write-Output ""
Write-Output "=== Type your question. Type --- on a new line to submit ==="
Write-Output ""

$lines = New-Object System.Collections.Generic.List[string]
while ($true) {
    $line = [Console]::In.ReadLine()
    if ($null -eq $line) { break }
    if ($line -eq "---") { break }
    $lines.Add($line)
}

$text = $lines -join "`n"

if ($SUFFIX.Trim()) {
    $text = $text + "`n" + $SUFFIX
}

Write-Output ""
Write-Output "=== Submitted. Wait for answer in chat... ==="
Write-Output ""
Write-Output $text
