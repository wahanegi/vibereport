import React, {Fragment, useEffect, useRef} from 'react';
import ReactDOM from "react-dom";
import Backdrop from "./Backdrop";

const portalStack = [];

const Portal = ({onClose, modalOverlay, elementId = 'overlays' }) => {
    const portalIdRef = useRef(Symbol('portal-modal'));

    const portalElement = document.getElementById(elementId)

    useEffect(() => {
        portalStack.push(portalIdRef.current);

        const handleKeyDown = (event) => {
            if (event.key !== 'Escape') return;

            const topPortalId = portalStack[portalStack.length - 1];
            if (topPortalId !== portalIdRef.current) return;

            onClose();
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            const index = portalStack.indexOf(portalIdRef.current);
            if (index !== -1) {
                portalStack.splice(index, 1);
            }
        };
    }, [onClose]);

    return (
        <Fragment>
            {ReactDOM.createPortal(<Backdrop />, portalElement)}
            {ReactDOM.createPortal( modalOverlay, portalElement)}
        </Fragment>
    );
};

export default Portal;