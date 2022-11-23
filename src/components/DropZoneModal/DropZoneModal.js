import DropZone from './DropZone';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

const DropZoneModal = ({ showModal, toggleModal, onAddFiles }) => {
  const dropZoneOnAndFiles = (files) => {
    toggleModal();
    onAddFiles(files);
  };

  return (
    <Modal isOpen={showModal} toggle={toggleModal} size="lg">
      <ModalBody>
        <DropZone onAddFiles={dropZoneOnAndFiles} />
      </ModalBody>
      <ModalFooter>
        <Button.Ripple color="danger" onClick={toggleModal}>
          close
        </Button.Ripple>
      </ModalFooter>
    </Modal>
  );
};

DropZoneModal.propTypes = {
  onAddFiles: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default DropZoneModal;