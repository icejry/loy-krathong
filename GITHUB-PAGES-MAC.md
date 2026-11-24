# ขึ้นเว็บไซต์ลอยกระทงบน GitHub Pages ด้วย MacBook

## 1. เปิดบน MacBook ก่อน (ไม่ต้องติดตั้งอะไร)

แตกไฟล์ ZIP แล้วดับเบิลคลิก `open-directly.html` ผ่าน Safari หรือ Chrome (ต้องเชื่อมอินเทอร์เน็ตสำหรับ Google Fonts). หากต้องการทดสอบแบบเดียวกับเว็บที่เผยแพร่ และ Mac มี Python 3 ให้เปิด Terminal ในโฟลเดอร์นี้แล้วรัน `python3 -m http.server 8000` จากนั้นเปิด `http://localhost:8000`.

## 2. อัปโหลดขึ้น GitHub ด้วยเว็บเบราว์เซอร์

1. ลงชื่อเข้าใช้ [GitHub](https://github.com) และเปิด https://github.com/new
2. สร้าง repository ชื่อ `loy-krathong` และเลือก **Public**. หากจะอัปโหลดเข้า repository เปล่า ไม่ต้องติ๊ก Add a README ตอนสร้าง
3. ที่หน้า repository คลิก **uploading an existing file** (หรือ **Add file → Upload files**) แล้วลาก **ไฟล์และโฟลเดอร์ทั้งหมดที่อยู่ข้างในโฟลเดอร์ `loy-krathong-github-pages`** เข้าไป โดยให้ `index.html` อยู่ระดับบนสุดของ repository (อย่าลากไฟล์ ZIP เดี่ยว ๆ)
4. คลิก **Commit changes** เพื่อบันทึกลง branch `main`
5. เปิด **Settings → Pages → Build and deployment → Source: Deploy from a branch**, เลือก **Branch: main**, **Folder: /(root)**, แล้วกด **Save**
6. GitHub จะแสดงลิงก์ที่หน้า Pages โดยทั่วไปคือ `https://USERNAME.github.io/loy-krathong/` (แทน USERNAME ด้วยชื่อบัญชีของคุณ)

หากเจอหน้า 404 ให้ตรวจว่า repository มี `index.html`, `css/`, `js/`, `assets/` อยู่ที่ root เหมือนกัน และตั้ง Pages ให้ใช้ `main` + `/(root)`; การเผยแพร่ครั้งแรกอาจใช้เวลาหลายนาที

## 3. ใช้ GitHub Desktop บน Mac (ทางเลือกที่เหมาะสำหรับแก้โค้ดต่อเนื่อง)

ดาวน์โหลด GitHub Desktop จาก https://desktop.github.com/ และลงชื่อเข้าใช้ เปิด File → Add Local Repository… แล้วเลือกโฟลเดอร์นี้ หากโปรแกรมแจ้งว่าไม่ใช่ Git Repository ให้เลือก **Create a repository here**. Commit ไฟล์ครั้งแรกแล้วคลิก **Publish repository**, ตั้งชื่อ `loy-krathong` และตั้งเป็น Public จากนั้นเปิดหน้า repository ในเว็บแล้วตั้ง Pages ตามข้อ 2. หลังแก้โค้ดครั้งต่อไป ให้ Commit แล้ว Push ใน GitHub Desktop โดยไม่ต้องอัปโหลดด้วยมือใหม่ทุกครั้ง

## โครงสร้างที่ต้องได้ในหน้า GitHub

```
index.html
.nojekyll
css/styles.css
js/app.js
js/audio.js
js/config.js
js/data.js
js/krathong.js
js/river.js
js/storage.js
assets/lotus.svg
assets/moonriver-original.mp3
backend/supabase.sql
README.md
```

## สิ่งที่ต้องทราบ

- GitHub Pages เป็น **Static Hosting** รองรับ HTML/CSS/JS และไฟล์เพลงที่มีอยู่ในชุดนี้โดยตรง ไม่ต้องติดตั้ง Node.js
- โปรแกรมเล่นเพลงหลังการแตะ/คลิกครั้งแรกเนื่องจากนโยบาย autoplay ของ Safari และเบราว์เซอร์อื่น
- กระทงที่สร้างบนอุปกรณ์ของตนเองบันทึกในเบราว์เซอร์นั้นได้ แต่ **ยังไม่ได้แชร์กับคนอื่น** หากไม่ตั้งค่า Supabase
- หากต้องการให้คนอื่นเห็นกระทงจริง: ทำตามส่วน Supabase ใน `README.md`, ใช้เพียง public/anon key ใน `js/config.js` **ห้ามใส่ service_role หรือ secret key** และตั้งระบบกลั่นกรอง/ป้องกันสแปมก่อนรับผู้ใช้งานจริง
- หากใช้ชื่อ repository อื่น ให้เปลี่ยน `loy-krathong` ใน URL ให้ตรงกับ repository จริง

เอกสารอ้างอิง: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
