#!/bin/bash

# Create directories
mkdir -p src/assets/images
mkdir -p src/assets/banners
mkdir -p src/assets/games
mkdir -p src/assets/icons
mkdir -p src/assets/theme/black-gold
mkdir -p src/assets/theme/deep-blue
mkdir -p src/assets/lottery

cd src/assets

# Main site images
echo "Downloading main site images..."
curl -sL "https://pusatcepat.site/resources/images/logo.png" -o images/logo.png
curl -sL "https://pusatcepat.site/resources/images/loading.svg" -o images/loading.svg
curl -sL "https://pusatcepat.site/resources/images/_icon-tip.svg" -o icons/icon-tip.svg
curl -sL "https://pusatcepat.site/resources/images/icon-forgot.svg" -o icons/icon-forgot.svg
curl -sL "https://pusatcepat.site/resources/images/arrow-3.png" -o icons/arrow-3.png
curl -sL "https://pusatcepat.site/resources/images/icon-bookmark.svg" -o icons/icon-bookmark.svg
curl -sL "https://pusatcepat.site/resources/images/icon-register.svg" -o icons/icon-register.svg
curl -sL "https://pusatcepat.site/resources/images/tabs-deposit.png" -o icons/tabs-deposit.png
curl -sL "https://pusatcepat.site/resources/images/tabs-withdrawal.png" -o icons/tabs-withdrawal.png
curl -sL "https://pusatcepat.site/resources/images/close-0.png" -o icons/close-0.png
curl -sL "https://pusatcepat.site/resources/images/icon-user.png" -o icons/icon-user.png
curl -sL "https://pusatcepat.site/resources/images/icon-psw.png" -o icons/icon-psw.png
curl -sL "https://pusatcepat.site/resources/images/authentication-0.svg" -o icons/authentication-0.svg
curl -sL "https://pusatcepat.site/resources/images/authentication-1.svg" -o icons/authentication-1.svg
curl -sL "https://pusatcepat.site/resources/images/authentication-2.svg" -o icons/authentication-2.svg
curl -sL "https://pusatcepat.site/resources/images/authentication-3.svg" -o icons/authentication-3.svg
curl -sL "https://pusatcepat.site/resources/images/work_together-0.png" -o images/work_together-0.png
curl -sL "https://pusatcepat.site/resources/images/work_together-1.webp" -o images/work_together-1.webp
curl -sL "https://pusatcepat.site/resources/images/work_together-2.png" -o images/work_together-2.png
curl -sL "https://pusatcepat.site/resources/images/work_together-3.png" -o images/work_together-3.png
curl -sL "https://pusatcepat.site/resources/images/work_together-4.webp" -o images/work_together-4.webp
curl -sL "https://pusatcepat.site/resources/images/work_together-5.webp" -o images/work_together-5.webp
curl -sL "https://pusatcepat.site/resources/images/work_together-6.webp" -o images/work_together-6.webp
curl -sL "https://pusatcepat.site/resources/images/work_together-7.png" -o images/work_together-7.png
curl -sL "https://pusatcepat.site/resources/images/work_together-8.png" -o images/work_together-8.png
curl -sL "https://pusatcepat.site/resources/images/work_together-9.webp" -o images/work_together-9.webp
curl -sL "https://pusatcepat.site/resources/images/icon-1.png" -o icons/icon-1.png
curl -sL "https://pusatcepat.site/resources/images/icon-2.png" -o icons/icon-2.png

# Theme Black-Gold
echo "Downloading theme black-gold..."
curl -sL "https://png-res.png999.com/resources/images/theme/black-gold/btnHome.png" -o theme/black-gold/btnHome.png
curl -sL "https://png-res.png999.com/resources/images/theme/black-gold/btnPromosi.png" -o theme/black-gold/btnPromosi.png
curl -sL "https://png-res.png999.com/resources/images/theme/black-gold/btnContact.png" -o theme/black-gold/btnContact.png
curl -sL "https://png-res.png999.com/resources/images/theme/black-gold/btnMenu.png" -o theme/black-gold/btnMenu.png
curl -sL "https://png-res.png999.com/resources/images/theme/black-gold/btnDeposit.png" -o theme/black-gold/btnDeposit.png
curl -sL "https://png-res.png999.com/resources/images/theme/black-gold/btnWithdrawal.png" -o theme/black-gold/btnWithdrawal.png

# Theme Deep-Blue
echo "Downloading theme deep-blue..."
curl -sL "https://png-res.png999.com/resources/images/theme/deep-blue/btnHome.png" -o theme/deep-blue/btnHome.png
curl -sL "https://png-res.png999.com/resources/images/theme/deep-blue/btnDeposit.png" -o theme/deep-blue/btnDeposit.png
curl -sL "https://png-res.png999.com/resources/images/theme/deep-blue/btnPromosi.png" -o theme/deep-blue/btnPromosi.png
curl -sL "https://png-res.png999.com/resources/images/theme/deep-blue/btnWithdrawal.png" -o theme/deep-blue/btnWithdrawal.png
curl -sL "https://png-res.png999.com/resources/images/theme/deep-blue/btnHot.png" -o theme/deep-blue/btnHot.png
curl -sL "https://png-res.png999.com/resources/images/theme/deep-blue/btnSlot.png" -o theme/deep-blue/btnSlot.png
curl -sL "https://png-res.png999.com/resources/images/theme/deep-blue/btnLivegame.png" -o theme/deep-blue/btnLivegame.png
curl -sL "https://png-res.png999.com/resources/images/theme/deep-blue/btnTogel.png" -o theme/deep-blue/btnTogel.png
curl -sL "https://png-res.png999.com/resources/images/theme/deep-blue/btnSport.png" -o theme/deep-blue/btnSport.png
curl -sL "https://png-res.png999.com/resources/images/theme/deep-blue/btnFishing.png" -o theme/deep-blue/btnFishing.png
curl -sL "https://png-res.png999.com/resources/images/theme/deep-blue/btnKartu.png" -o theme/deep-blue/btnKartu.png
curl -sL "https://png-res.png999.com/resources/images/theme/deep-blue/btnSelect.png" -o theme/deep-blue/btnSelect.png
curl -sL "https://png-res.png999.com/resources/images/theme/icn-hot-checked.png" -o theme/icn-hot-checked.png

# Banners
echo "Downloading banners..."
curl -sL "https://pusat88.sgp1.cdn.digitaloceanspaces.com/banner-web-pusattogel/CHINESE-NEWYEAR/PUSAT-POPUP-DEPOSIT%20HARIAN%2010%20-IMLEK.webp" -o banners/popup-deposit-imlek.webp
curl -sL "https://pusat88.sgp1.cdn.digitaloceanspaces.com/banner-web-pusattogel/Pusat-Togel-Banner-QRIS_Web_1.webp" -o banners/banner-qris.webp
curl -sL "https://pusat88.sgp1.cdn.digitaloceanspaces.com/banner-web-pusattogel/CHINESE-NEWYEAR/PUSAT-BONUS%20DEPOSIT%20HARIAN%2010%20-IMLEK.webp" -o banners/bonus-deposit-imlek.webp
curl -sL "https://pusat88.sgp1.cdn.digitaloceanspaces.com/banner-web-pusattogel/Peringatan-Web-PusatTogel69.webp" -o banners/peringatan.webp
curl -sL "https://pusat88.sgp1.cdn.digitaloceanspaces.com/banner-web-pusattogel/Hadiah%20Togel%20Pusat%20Togel%20Banner_Web.webp" -o banners/hadiah-togel.webp
curl -sL "https://pusat88.sgp1.cdn.digitaloceanspaces.com/NEW-PT/Banner-Web-PusatTogel-09.webp" -o banners/banner-09.webp
curl -sL "https://pusat88.sgp1.cdn.digitaloceanspaces.com/banner-web-pusattogel/Pusat-Togel-Banner-Baru.webp" -o banners/banner-baru.webp
curl -sL "https://pusat88.sgp1.cdn.digitaloceanspaces.com/banner-web-pusattogel/Banner_Putar%20Roda_Web.webp" -o banners/putar-roda.webp
curl -sL "https://pusat88.sgp1.cdn.digitaloceanspaces.com/banner-web-pusattogel/APK_WEB_CARIKAN-REVISI.webp" -o banners/apk-download.webp
curl -sL "https://pusat88.sgp1.cdn.digitaloceanspaces.com/banner-web-pusattogel/Welcome-Bonus-New-Member-30__1.webp" -o banners/welcome-bonus.webp

# Game Images
echo "Downloading game images..."
curl -sL "https://png-res.png999.com/assets/assetss/Baccarat_1693294377627.png" -o games/baccarat.png
curl -sL "https://png-res.png999.com/assets/assetss/DragonTiger_1693294284830.png" -o games/dragon-tiger.png
curl -sL "https://png-res.png999.com/assets/PP-Web/1301.png" -o games/pp-1301.png
curl -sL "https://png-res.png999.com/assets/PP-Web/1101.png" -o games/pp-1101.png
curl -sL "https://png-res.png999.com/assets/PP-Web/vs20starlightx.png" -o games/starlight-princess.png
curl -sL "https://png-res.png999.com/assets/PP-Web/vs20fruitswx.png" -o games/sweet-bonanza.png
curl -sL "https://png-res.png999.com/assets/PP-Web/vs20olympx.png" -o games/gates-of-olympus.png
curl -sL "https://png-res.png999.com/assets/PP-Web/vswaysmahwblck.png" -o games/mahjong-ways.png

# Sports Images
echo "Downloading sports images..."
curl -sL "https://png-res.png999.com/assets/SBO-Web/cardList/SportsBook/4.png" -o games/sbobet.png
curl -sL "https://png-res.png999.com/assets/SBO-Web/cardList/ThirdPartySportsBook/2.png" -o games/saba-sports.png

# Lottery Icons
echo "Downloading lottery icons..."
curl -sL "https://png-res.png999.com/assets/LOTTERY-Web/cardList/TTM4/icon/icon.png" -o lottery/toto-macau.png
curl -sL "https://png-res.png999.com/assets/LOTTERY-Web/cardList/SGD/icon/icon.png" -o lottery/singapore.png
curl -sL "https://png-res.png999.com/assets/LOTTERY-Web/cardList/HKGLT/icon/icon.png" -o lottery/hongkong.png
curl -sL "https://png-res.png999.com/assets/LOTTERY-Web/cardList/SYDLT/icon/icon.png" -o lottery/sydney.png

echo "Download complete!"
echo ""
echo "Assets saved to src/assets/"
ls -la images/ icons/ banners/ games/ lottery/ theme/
