# ȯ�� ���� ����
$env:PATH = "E:\workspace\AIMUSIC_2\clidriver\bin;E:\workspace\AIMUSIC_2\clidriver\lib;" + $env:PATH
$env:LIB = "E:\workspace\AIMUSIC_2\clidriver\bin;E:\workspace\AIMUSIC_2\clidriver\lib;" + $env:LIB
$env:DB2CODEPAGE = "1208"

# ���� ���� ����
Start-Process -FilePath "E:\workspace\AIMUSIC_2\aimusic_2.exe"
