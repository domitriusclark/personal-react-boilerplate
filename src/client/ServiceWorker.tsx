import { Box, useToast, Flex, Icon } from '@chakra-ui/core';
import React, { useEffect } from 'react';

const sw = '/service-worker.js';

/**
 * Currently mimics toast({status: 'info'}) to allow a global onClick
 */
const RefreshToast = () => (
  <Flex
    backgroundColor="blue.500"
    pl={4}
    pr={8}
    pt={3}
    pb={3}
    borderRadius="0.25rem"
    m={2}
    onClick={() => window.location.reload()}
    cursor="pointer"
    role="alert"
  >
    <Icon name="info" width="1.25rem" height="1.25rem" mr="0.75rem" />
    <Box textAlign="left">
      <Box as="p" fontWeight="bold">
        A new version is available!
      </Box>
      Click to refresh now.
    </Box>
  </Flex>
);

export default function ServiceWorker() {
  const toast = useToast();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(sw).then(registration => {
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;

          if (!installingWorker) {
            return;
          }

          installingWorker.addEventListener('statechange', () => {
            if (
              installingWorker.state !== 'installed' ||
              !navigator.serviceWorker.controller
            ) {
              return;
            }

            toast({
              render: RefreshToast,
            });
          });
        });
      });
    }
  }, [toast]);

  return null;
}
