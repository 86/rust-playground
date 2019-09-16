import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Manager, Popper, Reference } from 'react-popper';
import { Portal } from 'react-portal';

import styles from './PopButton.module.css';

interface NewPopProps {
  Button: React.ComponentType<{
    toggle: () => void;
  } & React.RefAttributes<HTMLElement>>;
  Menu: React.ComponentType<{ close: () => void }>;
}

const PopButton: React.SFC<NewPopProps> = ({ Button, Menu }) => {
  const [isOpen, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen(v => !v), []);
  const close = useCallback(() => setOpen(false), []);

  const buttonRef = useRef<HTMLElement>();
  const menuRef = useRef<HTMLElement>();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && buttonRef.current.contains(event.target)) {
        // They are clicking on the button, so let that go ahead and close us.
        return;
      }

      if (menuRef.current && !menuRef.current.contains(event.target)) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [close]);

  return (
    <Manager>
      <Reference>
        {({ ref }) => <Button ref={(r) => { ref(r); buttonRef.current = r; }} toggle={toggle} />}
      </Reference>
      {isOpen && <Portal>
        <Popper placement="bottom" modifiers={{ computeStyle: { gpuAcceleration: false } }}>
          {({ ref, style, arrowProps, placement }) => (
            <div
              className={styles.container}
              ref={(r) => { ref(r); menuRef.current = r; }}
              style={style}
              data-placement={placement}
            >
              <div
                className={styles.arrow}
                ref={arrowProps.ref}
                style={arrowProps.style}
              />
              <div className={styles.content}>
                <Menu close={close} />
              </div>
            </div>
          )}
        </Popper>
      </Portal>}
    </Manager>
  );
};

export default PopButton;
