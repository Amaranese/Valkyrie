import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../lib/utils/cropImage';

interface IProps {
  isOpen: boolean;
  initialImage: string;
  applyCrop: (image: Blob) => void;
  onClose: () => void;
}

export const CropImageModal: React.FC<IProps> = ({ isOpen, onClose, applyCrop, initialImage }) => {
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_: any, croppedAreaPixelsResult: any) => {
    setCroppedAreaPixels(croppedAreaPixelsResult);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(initialImage, croppedAreaPixels);
      applyCrop(croppedImage);
    } catch (e) {}
  }, [croppedAreaPixels, initialImage, applyCrop]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={false}>
      <ModalOverlay />

      <ModalContent bg="brandGray.light">
        <ModalHeader fontWeight="bold">EDIT MEDIA</ModalHeader>
        <ModalCloseButton _focus={{ outline: 'none' }} />
        <ModalBody>
          <Box h="400px" overflow="hidden" position="relative">
            <Cropper
              image={initialImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </Box>
          <Slider
            aria-label="zoom"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(value: number) => setZoom(value)}
            my="4"
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </ModalBody>

        <ModalFooter bg="brandGray.dark">
          <Button onClick={onClose} fontSize="14px" mr={6} variant="link">
            Cancel
          </Button>
          <Button
            background="highlight.standard"
            color="white"
            type="submit"
            fontSize="14px"
            _hover={{ bg: 'highlight.hover' }}
            _active={{ bg: 'highlight.active' }}
            _focus={{ boxShadow: 'none' }}
            onClick={showCroppedImage}
          >
            Apply
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
