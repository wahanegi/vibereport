import React from 'react';
import Modal from 'react-bootstrap/Modal';
import {useNavigate} from 'react-router-dom';
import xClose from '../../../../assets/images/sys_svg/x-close.svg';
import {updateResponse} from '../../requests/axios_requests';
import Button from '../../UI/Button';

const WorkingModal = ({show, setShow, data, setData, steps}) => {
    const navigate = useNavigate();
    const handleNotWorking = async () => {
        const index = steps.indexOf('emotion-selection-web');
        const newSteps = steps.slice(0, index + 1);
        const pathToStep = `/${newSteps.at(-1)}`
        const dataRequest = {
            response: {
                attributes: {
                    not_working: false,
                    draft: false,
                    steps: newSteps
                },
            },
        };

        await updateResponse(
            data,
            setData,
            dataRequest,
            navigate(pathToStep)
        );
    };

    const handleHideModal = () =>
        setShow(false);

    const WorkCheckHeader = () => <>
        <h2 className="px-3 mb-2 mt-1">
            Just to confirm...
        </h2>
        <h2 className="fs-4 mb-3">
            Did you work during this <br/> check-in period?
        </h2>
        <h2 className="mb-4">
            You previously indicated that you weren't
            <br/> working during this check-in period.
        </h2>
        <h2 className="mb-2">
            Skip this check-in if you weren't working.
        </h2>
    </>

    const SkipAction = () =>
        <div className="d-flex justify-content-lg-between">
            <Button className="btn-modal c1 bg-danger border-0 w-auto fs-5 m-3" onClick={handleHideModal}>
                Skip check-in
            </Button>
            <Button className="btn-modal c1 border-0 w-auto fs-5 m-3" onClick={handleNotWorking}>
                Yes, I worked
            </Button>
        </div>


    return <Modal size="lg" show={show} onHide={handleHideModal} animation={true} centered dialogClassName="px-1">
        <button className="position-absolute top-0 start-100 translate-middle x-close bg-transparent border-0"
                onClick={handleHideModal}>
            <img src={xClose} alt={'Close'}/>
        </button>
        <Modal.Body>
            <WorkCheckHeader/>
            <SkipAction/>
        </Modal.Body>
    </Modal>
};

export default WorkingModal;
