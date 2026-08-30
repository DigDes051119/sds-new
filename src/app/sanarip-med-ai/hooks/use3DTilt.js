import { useMotionValue, useSpring, useTransform } from 'framer-motion';

export function use3DTilt({ maxTilt = 12, scaleHover = 1.02 } = {}) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateXSpring = useSpring(useTransform(y, [0, 1], [maxTilt, -maxTilt]), {
    stiffness: 150,
    damping: 18,
  });

  const rotateYSpring = useSpring(useTransform(x, [0, 1], [-maxTilt, maxTilt]), {
    stiffness: 150,
    damping: 18,
  });

  const scaleSpring = useSpring(1, { stiffness: 200, damping: 15 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseEnter = () => {
    scaleSpring.set(scaleHover);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
    scaleSpring.set(1);
  };

  return {
    rotateX: rotateXSpring,
    rotateY: rotateYSpring,
    scale: scaleSpring,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  };
}
