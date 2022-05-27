import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { InputField } from '../common/InputField';
import { GuildSchema } from '../../lib/utils/validation/guild.schema';
import { createGuild, joinGuild } from '../../lib/api/handler/guilds';
import { userStore } from '../../lib/stores/userStore';
import { toErrorMap } from '../../lib/utils/toErrorMap';
import { gKey } from '../../lib/utils/querykeys';
import { Guild } from '../../lib/models/guild';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

enum AddGuildScreen {
  START,
  INVITE,
  CREATE,
}

export const AddGuildModal: React.FC<IProps> = ({ isOpen, onClose }) => {
  const [screen, setScreen] = useState(AddGuildScreen.START);

  const goBack = (): void => setScreen(AddGuildScreen.START);
  const submitClose = (): void => {
    setScreen(AddGuildScreen.START);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={submitClose} isCentered size="sm">
      <ModalOverlay />

      {screen === AddGuildScreen.INVITE && <JoinServerModal goBack={goBack} submitClose={submitClose} />}
      {screen === AddGuildScreen.CREATE && <CreateServerModal goBack={goBack} submitClose={submitClose} />}
      {screen === AddGuildScreen.START && (
        <ModalContent bg="brandGray.light">
          <ModalHeader textAlign="center" fontWeight="bold">
            Create a server
          </ModalHeader>
          <ModalCloseButton _focus={{ outline: 'none' }} />
          <ModalBody pb={6}>
            <VStack spacing="5">
              <Text textAlign="center">
                Your server is where you and your friends hang out. Make yours and start talking.
              </Text>

              <Button
                background="highlight.standard"
                color="white"
                type="submit"
                _hover={{ bg: 'highlight.hover' }}
                _active={{ bg: 'highlight.active' }}
                _focus={{ boxShadow: 'none' }}
                w="full"
                onClick={() => setScreen(AddGuildScreen.CREATE)}
              >
                Create My Own
              </Button>

              <Divider />

              <Text>Have an invite already?</Text>

              <Button
                mt="4"
                background="highlight.standard"
                color="white"
                type="submit"
                _hover={{ bg: 'highlight.hover' }}
                _active={{ bg: 'highlight.active' }}
                _focus={{ boxShadow: 'none' }}
                w="full"
                onClick={() => setScreen(AddGuildScreen.INVITE)}
              >
                Join a Server
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      )}
    </Modal>
  );
};

interface IScreenProps {
  goBack: () => void;
  submitClose: () => void;
}

const JoinServerModal: React.FC<IScreenProps> = ({ goBack, submitClose }) => {
  const cache = useQueryClient();
  const navigate = useNavigate();

  return (
    <ModalContent bg="brandGray.light">
      <Formik
        initialValues={{
          link: '',
        }}
        onSubmit={async (values, { setErrors }) => {
          if (values.link === '') {
            setErrors({ link: 'Enter a valid link' });
          } else {
            try {
              const { data } = await joinGuild(values);
              if (data) {
                cache.setQueryData<Guild[]>(gKey, (old) => [...old!, data]);
                submitClose();
                navigate(`/channels/${data.id}/${data.default_channel_id}`);
              }
            } catch (err: any) {
              const status = err?.response?.status;
              if (status === 400 || status === 500) {
                setErrors({ link: err?.response?.data?.error.message });
              }
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <ModalHeader textAlign="center" fontWeight="bold" pb="0">
              Join a Server
            </ModalHeader>
            <ModalCloseButton _focus={{ outline: 'none' }} />
            <ModalBody pb={3}>
              <Text fontSize="14px" textColor="brandGray.accent">
                Enter an invite below to join an existing server
              </Text>
              <InputField label="invite link" name="link" />

              <Text mt="4" fontSize="12px" fontWeight="semibold" textColor="brandGray.accent" textTransform="uppercase">
                invite links should look like
              </Text>

              <Text mt="2" fontSize="12px" textColor="brandGray.accent">
                hTKzmak
              </Text>
              <Text fontSize="12px" textColor="brandGray.accent">
                https://valkyrieapp.xyz/hTKzmak
              </Text>
            </ModalBody>

            <ModalFooter bg="brandGray.dark">
              <Button mr={6} variant="link" onClick={goBack} fontSize="14px" _focus={{ outline: 'none' }}>
                Back
              </Button>
              <Button
                background="highlight.standard"
                color="white"
                type="submit"
                _hover={{ bg: 'highlight.hover' }}
                _active={{ bg: 'highlight.active' }}
                _focus={{ boxShadow: 'none' }}
                isLoading={isSubmitting}
                fontSize="14px"
              >
                Join Server
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </ModalContent>
  );
};

const CreateServerModal: React.FC<IScreenProps> = ({ goBack, submitClose }) => {
  const user = userStore((state) => state.current);
  const cache = useQueryClient();
  const navigate = useNavigate();

  return (
    <ModalContent bg="brandGray.light">
      <Formik
        initialValues={{
          name: `${user?.username}'s server`,
        }}
        validationSchema={GuildSchema}
        onSubmit={async (values, { setErrors }) => {
          try {
            const { data } = await createGuild(values);
            if (data) {
              cache.setQueryData<Guild[]>(gKey, (old) => [...old!, data]);
              submitClose();
              navigate(`/channels/${data.id}/${data.default_channel_id}`);
            }
          } catch (err: any) {
            if (err?.response?.status === 400) {
              setErrors({ name: 'The server limit is 100' });
            }
            if (err?.response?.data?.errors) {
              const errors = err?.response?.data?.errors;
              setErrors(toErrorMap(errors));
            }
          }
        }}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <ModalHeader textAlign="center" fontWeight="bold" pb="0">
              Create your server
            </ModalHeader>
            <ModalCloseButton _focus={{ outline: 'none' }} />
            <ModalBody pb={3}>
              <InputField label="server name" name="name" value={values.name} />
            </ModalBody>

            <ModalFooter bg="brandGray.dark">
              <Button mr={6} fontSize="14px" variant="link" onClick={goBack} _focus={{ outline: 'none' }}>
                Back
              </Button>
              <Button
                background="highlight.standard"
                color="white"
                type="submit"
                _hover={{ bg: 'highlight.hover' }}
                _active={{ bg: 'highlight.active' }}
                _focus={{ boxShadow: 'none' }}
                isLoading={isSubmitting}
                fontSize="14px"
              >
                Create
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </ModalContent>
  );
};
