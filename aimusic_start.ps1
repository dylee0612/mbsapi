# ȯ�� ���� ����
$env:PATH = "E:\workspace\AIMUSIC\clidriver\bin;E:\workspace\AIMUSIC\clidriver\lib;" + $env:PATH
$env:LIB = "E:\workspace\AIMUSIC\clidriver\bin;E:\workspace\AIMUSIC\clidriver\lib;" + $env:LIB
$env:DB2CODEPAGE = "1208"

# ���� ���� ����
Start-Process -FilePath "E:\workspace\AIMUSIC\aimusic.exe"
