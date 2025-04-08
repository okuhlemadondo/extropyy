import { useEffect } from 'react';

export default function Cursor() {
    useEffect(() => {
        const cursor = document.querySelector('.custom-cursor');

        if (!cursor) return;

        const updateCursor = (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        };

        const activateCursor = () => {
            cursor.classList.add('active');
        };

        const deactivateCursor = () => {
            cursor.classList.remove('active');
        };

        document.addEventListener('mousemove', updateCursor);
        document.addEventListener('mousedown', activateCursor);
        document.addEventListener('mouseup', deactivateCursor);

        return () => {
            document.removeEventListener('mousemove', updateCursor);
            document.removeEventListener('mousedown', activateCursor);
            document.removeEventListener('mouseup', deactivateCursor);
        };
    }, []);

    return <div className="custom-cursor"></div>;
}