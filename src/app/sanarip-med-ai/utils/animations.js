export const appleScrollVariant = {
  hidden: { 
    opacity: 0, 
    y: 60, 
    filter: 'blur(15px)' 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)', 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

export const containerVariant = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 }
  }
};
