# 환경 변수 설정
$env:PATH = "E:\workspace\AIMUSIC\clidriver\bin;E:\workspace\AIMUSIC\clidriver\lib;" + $env:PATH
$env:LIB = "E:\workspace\AIMUSIC\clidriver\bin;E:\workspace\AIMUSIC\clidriver\lib;" + $env:LIB
$env:DB2CODEPAGE = "1208"

# 실행 파일 실행
Start-Process -FilePath "E:\workspace\AIMUSIC\aimusic.exe"
