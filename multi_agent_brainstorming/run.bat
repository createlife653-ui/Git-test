@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

echo ================================================
echo  マルチエージェント・ブレインストーミングシステム
echo ================================================
echo.

REM トピック入力を促す
set /p topic="ブレインストーミングのトピックを入力してください: "

REM 入力チェック
if "%topic%"=="" (
    echo エラー: トピックが入力されていません
    pause
    exit /b 1
)

echo.
echo 開始します...
echo.

REM Pythonスクリプトを実行
python main.py "%topic%" --turns 30

echo.
echo ================================================
echo  完了しました！
echo ================================================
pause
