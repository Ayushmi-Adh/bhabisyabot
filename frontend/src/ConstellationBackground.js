import React, { useRef, useEffect } from "react";

function ConstellationBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        // create stars
        const stars = [];
        const STAR_COUNT = 90;

        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                radius: Math.random() * 2,
            });
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);

            // Draw stars
            ctx.fillStyle = "white";
            stars.forEach((s) => {
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                ctx.fill();

                // Update star position
                s.x += s.vx;
                s.y += s.vy;

                // Bounce stars off edges
                if (s.x < 0 || s.x > width) s.vx *= -1;
                if (s.y < 0 || s.y > height) s.vy *= -1;
            });

            // Draw connecting lines
            for (let i = 0; i < STAR_COUNT; i++) {
                for (let j = i + 1; j < STAR_COUNT; j++) {
                    const dx = stars[i].x - stars[j].x;
                    const dy = stars[i].y - stars[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 140) {
                        ctx.strokeStyle = "rgba(255,255,255,0.15)";
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(stars[i].x, stars[i].y);
                        ctx.lineTo(stars[j].x, stars[j].y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(draw);
        }

        draw();

        // Adjust canvas size on resize
        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full z-0"
        ></canvas>
    );
}

export default ConstellationBackground;
