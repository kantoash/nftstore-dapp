import React, { useState } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { motion } from "framer-motion";

interface AttributesCardProps {
  attributesList?: string[];
  setAttributesList: (val: string[]) => void;
  disabled: boolean;
}

const AttributesCard: React.FC<AttributesCardProps> = ({
  attributesList,
  setAttributesList,
}) => {
  const [isAttributeOpen, setIsAttributeOpen] = useState(false);
  const [attribute, setAttribute] = useState("");

  const AttributeAdd = () => {
    if (!attribute) {
      return;
    }

    if (!attributesList) {
      setAttributesList([attribute]);
    } else {
      setAttributesList([...attributesList, attribute]);
    }
  };

  const AttributeMinus = (_attribute: string) => {
    if (!attributesList || !_attribute) {
      return;
    }

    const newAttributeList = attributesList.filter(
      (attribute) => attribute !== _attribute
    );
    setAttributesList(newAttributeList);
  };
  return (
    <div className="flex flex-col justify-between rounded-xl bg-[#394b61] bg-opacity-50 p-3">
      {attributesList && (
        <div className="flex items-center flex-wrap gap-3 ">
          {attributesList.map((attribute, index) => (
            <div key={index} className="text-gray-300 bg-[#394b61] bg-opacity-60 p-2 rounded-xl flex items-center text-sm space-x-3">
              <h3>{attribute}</h3>
              <button
                onClick={() => AttributeMinus(attribute)}
                className="border border-gray-300 p-1 rounded-full cursor-pointer"
              >
                <AiOutlineMinus size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between text-gray-300 py-2">
        <h2>Attributes</h2>
        <button
          onClick={() => setIsAttributeOpen((val) => !val)}
          className="border border-gray-300 p-1 rounded-full cursor-pointer"
        >
          <AiOutlinePlus />
        </button>
      </div>
      {isAttributeOpen && (
        <motion.div
          initial={{
            y: -100,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.5,
            },
          }}
        >
          <div className="flex flex-row mt-5 items-center w-full overflow-hidden rounded-xl">
            <input
              type="text"
              name="attribute"
              placeholder="Attribute"
              value={attribute}
              onChange={(e) => setAttribute(e.target.value)}
              className="flex-1 bg-[#394b61] bg-opacity-60  p-3 text-gray-300 placeholder:text-gray-300 border-0 focus:outline-none focus:ring-0 "
            />
            <div
              onClick={AttributeAdd}
              className="bg-white text-blue-400 whitespace-nowrap px-4 py-2.5 border-2 border-blue-400 rounded-r-xl cursor-pointer"
            >
              Confirm
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AttributesCard;
