import React from "react";
import { motion } from "framer-motion";

interface MenuOptionProps {
  title: string;
}

const MenuOption: React.FC<MenuOptionProps> = ({ title }) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        transition: { delay: 0.5, duration: 0.7 },
      }}
      className="text-2xl cursor-pointer text-[#829eb1] hover:text-[#515f75]"
    >
      {title}
    </motion.div>
  );
};

export default MenuOption;
