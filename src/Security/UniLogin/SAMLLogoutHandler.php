<?php

namespace App\Security\UniLogin;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Logout\LogoutHandlerInterface;

/**
 * Class SAMLLogoutHandler.
 */
class SAMLLogoutHandler implements LogoutHandlerInterface
{
    /**
     * @var SAMLAuthenticator
     */
    private $saml;

    /**
     * SAMLLogoutHandler constructor.
     *
     * @param SAMLAuthenticator $saml
     */
    public function __construct(SAMLAuthenticator $saml)
    {
        $this->saml = $saml;
    }

    /**
     * @param Request        $request
     * @param Response       $response
     * @param TokenInterface $token
     *
     * @throws \OneLogin\Saml2\Error
     */
    public function logout(Request $request, Response $response, TokenInterface $token)
    {
        if ($this->saml->supportsSingleLogout()) {
            $this->saml->getAuth()->logout();
        }
    }
}
