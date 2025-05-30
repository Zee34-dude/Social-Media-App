import { useEffect, useRef } from "react";




const DatabaseLandingAnimation = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    type Points = Record<'x' | 'y' | 'radius' | 'dx' | 'dy', number>;
    useEffect(() => {
        const canvas = canvasRef.current as HTMLCanvasElement | null;
        const ctx = canvas?.getContext("2d") as CanvasRenderingContext2D;
        let animationId: number;
        console.log({ y: canvas }, ctx)


        // Set canvas to full size of its parent 
        function setCanvasSize() {
            if (canvas && canvas.parentElement) {
                canvas.width = canvas.parentElement.offsetWidth;  // Set the canvas pixel width to match its displayed width to avoid blurry rendering
                canvas.height = canvas.parentElement.offsetHeight; // Set the canvas pixel height to match its displayed height

            }
        }


        setCanvasSize()

        // Data points
        const points: Points[] = [];
        const pointCount = 250;
        if (canvas && canvas.parentElement) {
            for (let i = 0; i < pointCount; i++) {
                points.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 3 + 1,
                    dx: Math.random() * 4 - 1,
                    dy: Math.random() * 4 - 1,
                });
            }
            console.log(points)
            const draw = () => {
                if (!ctx) return
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw each point
                points.forEach((point) => {
                    ctx.beginPath();//Starts a new path(always call this before drawing a shape)
                    ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);//Draws a circle or an arc
                    ctx.fillStyle = "#213ec0f1"; //fill with green
                    ctx.fill();//fills the current path with fillstyle
                });

                // Draw connections
                // for (let i = 0; i < points.length; i++) {
                //     for (let j = i + 1; j < points.length; j++) {
                //         const dist = Math.hypot(
                //             points[i].x - points[j].x,
                //             points[i].y - points[j].y
                //         );
                //         if (dist < 100) {
                //             ctx.beginPath();
                //             ctx.moveTo(points[i].x, points[i].y);//Moves the pen to(x,y) without drawing
                //             ctx.lineTo(points[j].x, points[j].y);//draws a line from current point to (x,y)
                //             ctx.strokeStyle = `rgba(0, 255, 255, ${1 - dist / 100})`;//sets the line color(opacity reduces with distance)
                //             ctx.lineWidth = 0.6;
                //             ctx.stroke();
                //         }
                //     }
                // }

                points.forEach((point) => {
                    point.x += point.dx;
                    point.y += point.dy;

                    if (point.x < 0 || point.x > canvas.width) point.dx *= -1;
                    if (point.y < 0 || point.y > canvas.height) point.dy *= -1;
                });

                animationId = requestAnimationFrame(draw);
            };

            draw();

            const handleResize = () => {
                setCanvasSize();
            };

            window.addEventListener("resize", handleResize);
            return () => {
                window.removeEventListener("resize", handleResize);
            };
        };
        return () => {
            cancelAnimationFrame(animationId)
        }

    }, []);

    return (
        <>
            <div
                style={{
                    position: 'relative',
                    width: "100vw",
                    height: "630px",
                    overflow: "hidden",
                }}
            >
                <canvas
                    ref={canvasRef}
                    className="canvas"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: '#020b31'

                    }}
                ></canvas>
            </div>
        </>

    );
};

export default DatabaseLandingAnimation;
// className={`${classes.pulse} p-5`}
// className={`${classes.sideContainer}`}