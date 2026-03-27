import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const AnimatedList = ({ items, itemDataKey, ItemComponent, current_user, setItems }) => {
  return (
    <motion.ul className="list-unstyled p-0 m-0">
      <AnimatePresence>
        {items.map((data) => {
          const item = data[itemDataKey];
          if (!item) return null;

          return (
            <motion.li
              key={`${itemDataKey}-${item.id}`}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 70, damping: 10 }}
            >
              <ItemComponent
                {...data}
                current_user={current_user}
                itemsArray={items}
                setItemsArray={setItems}
              />
            </motion.li>
          );
        })}
      </AnimatePresence>
    </motion.ul>
  );
};

export default AnimatedList;
