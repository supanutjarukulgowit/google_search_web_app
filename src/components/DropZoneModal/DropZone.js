import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const DropZone = ({ onAddFiles, multiple }) => {
  const onDrop = useCallback(
    (acceptedFiles) => _.isFunction(onAddFiles) && onAddFiles(acceptedFiles),
    [],
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple });
  return (
        <div {...getRootProps()} className="w-full min-h-[20vh] p-4 flex">
          <div
            className={
              'flex flex-col border-8 border-dotted border-orange01 cursor-pointer items-center justify-center flex-1 py-5'
            }
          >
            <input {...getInputProps()} />
            <FontAwesomeIcon
              className={'text-orange01 text-[5rem] mb-3'}
              icon={faCloudUploadAlt}
            />
            <p className="mb-1">Drag & drop to upload</p>
            <p className={'text-blue01'}>or browse</p>
          </div>
        </div>
      );
};

DropZone.propTypes = {
  onAddFiles: PropTypes.func,
  multiple: PropTypes.bool,
};

DropZone.defaultProps = {
  multiple: true,
};

export default DropZone;


