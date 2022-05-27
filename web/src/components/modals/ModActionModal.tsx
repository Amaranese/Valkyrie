import {
  Button,
  LightMode,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { mKey } from '../../lib/utils/querykeys';
import { Member } from '../../lib/models/member';
import { RouterProps } from '../../lib/models/routerProps';
import { banMember, kickMember } from '../../lib/api/handler/members';

interface IProps {
  member: Member;
  isOpen: boolean;
  isBan: boolean;
  onClose: () => void;
}

export const ModActionModal: React.FC<IProps> = ({ member, isOpen, onClose, isBan }) => {
  const cache = useQueryClient();
  const action = isBan ? 'Ban ' : 'Kick ';
  const { guildId } = useParams<keyof RouterProps>() as RouterProps;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />

      <ModalContent bg="brandGray.light">
        <ModalHeader textTransform="uppercase" fontWeight="bold" fontSize="14px" mb={0} pb={0}>
          {action}&apos;{member.username}&apos;
        </ModalHeader>
        <ModalBody>
          <Text mb="4">
            Are you sure you want to {action.toLocaleLowerCase()} @{member.username}?
            {!isBan && ' They will be able to rejoin again with a new invite.'}
          </Text>
        </ModalBody>

        <ModalFooter bg="brandGray.dark">
          <Button onClick={onClose} mr={6} variant="link" fontSize="14px" _focus={{ outline: 'none' }}>
            Cancel
          </Button>
          <LightMode>
            <Button
              colorScheme="red"
              fontSize="14px"
              onClick={async () => {
                onClose();
                try {
                  const { data } = isBan ? await banMember(guildId, member.id) : await kickMember(guildId, member.id);
                  if (data) {
                    cache.setQueryData<Member[]>(mKey(guildId), (d) => {
                      if (d !== undefined) return d!.filter((f) => f.id !== member.id);
                      return d!;
                    });
                  }
                } catch (err) {}
              }}
            >
              {action}
            </Button>
          </LightMode>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
