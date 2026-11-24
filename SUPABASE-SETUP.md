# เปิดกำแพงคำอธิษฐานร่วมกัน (Supabase)

1. สมัครและสร้างโปรเจกต์ที่ supabase.com
2. ไปที่ SQL Editor แล้วรันไฟล์ `backend/supabase.sql` เพื่อสร้างตาราง `krathong_wishes`
3. คัดลอก Project URL และ anon public key (ห้ามใช้ service_role) ไปใส่ใน `js/config.js`
4. ข้อความใหม่จะรออนุมัติ เปิด Table Editor แล้วเปลี่ยนคอลัมน์ `status` เป็น `approved` เฉพาะข้อความที่เหมาะสม กระทงจะปรากฏในแม่น้ำของทุกคน
5. สร้าง `open-directly.html` ใหม่ด้วย `python3 tests/build_standalone.py`
