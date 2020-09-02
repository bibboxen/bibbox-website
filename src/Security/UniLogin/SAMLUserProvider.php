<?php

namespace App\Security\UniLogin;

use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;

/**
 * Class SAMLUserProvider.
 */
class SAMLUserProvider implements UserProviderInterface
{
    /** @var UserManagerInterface */
    private $userManager;

    /** @var SAMLAuthenticator */
    private $saml;

    /**
     * SAMLUserProvider constructor.
     *
     * @param SAMLAuthenticator    $saml
     */
    public function __construct(SAMLAuthenticator $saml)
    {
        $this->saml = $saml;
    }

    /**
     * Get user.
     *
     * @param string $username
     * @param string $displayName
     * @param array  $credentials
     *
     * @return UserInterface|null
     *
     * @throws \OneLogin\Saml2\Error
     * @throws \OneLogin\Saml2\ValidationError
     */
    public function getUser(string $username, string $displayName, array $credentials)
    {
        $user = $this->userManager->findUserByUsername($username);

        if (null === $user) {
            $user = $this->userManager->createUser();
            $user->setUsername($username);
        }

        if (empty($user->getName())) {
            $user->setName($displayName);
        }

        $roles = $this->saml->getRoles($credentials['SAMLResponse']);
        $user->setRoles($roles);

        $this->userManager->updateUser($user);

        return $user;
    }

    /**
     * @param string $username
     *
     * @return UserInterface|void
     */
    public function loadUserByUsername($username)
    {
        throw new \RuntimeException(sprintf('Lazy programmer exception: %s not implemented!', __METHOD__));
    }

    /**
     * @param UserInterface $user
     *
     * @return UserInterface|null
     */
    public function refreshUser(UserInterface $user)
    {
        if (!$user instanceof UserInterface) {
            throw new UnsupportedUserException(sprintf('Expected an instance of %s, but got "%s".', UserInterface::class, \get_class($user)));
        }

        if (!$this->supportsClass(\get_class($user))) {
            throw new UnsupportedUserException(sprintf('Expected an instance of %s, but got "%s".', $this->userManager->getClass(), \get_class($user)));
        }

        if (null === $reloadedUser = $this->userManager->findUserBy(['id' => $user->getId()])) {
            throw new UsernameNotFoundException(sprintf('User with ID "%s" could not be reloaded.', $user->getId()));
        }

        return $reloadedUser;
    }

    /**
     * @param string $class
     *
     * @return bool
     */
    public function supportsClass($class)
    {
        $userClass = $this->userManager->getClass();

        return $userClass === $class || is_subclass_of($class, $userClass);
    }
}
