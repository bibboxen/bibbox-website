<?php

namespace App\Security\UniLogin;

use OneLogin\Saml2\Auth;
use OneLogin\Saml2\Error;
use OneLogin\Saml2\IdPMetadataParser;
use OneLogin\Saml2\Response;
use OneLogin\Saml2\Settings;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;

/**
 * Class SAMLAuthenticator.
 */
class SAMLAuthenticator extends AbstractGuardAuthenticator
{
    /** @var \Symfony\Component\Routing\RouterInterface */
    private $router;

    /** @var array */
    private $settings;

    /**
     * SAMLAuthenticator constructor.
     *
     * @param RouterInterface $router
     * @param array $samlAuthenticatorSettings
     */
    public function __construct(RouterInterface $router, array $samlAuthenticatorSettings)
    {
        $this->router = $router;
        $this->settings = $samlAuthenticatorSettings;
    }

    /**
     * @param Request                      $request
     * @param AuthenticationException|null $authException
     *
     * @return RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function start(Request $request, AuthenticationException $authException = null)
    {
        $url = $this->router->generate('saml_login');

        return new RedirectResponse($url);
    }

    /**
     * @param Request $request
     *
     * @return bool
     */
    public function supports(Request $request)
    {
        return '/unilogin/acs' === $request->getPathInfo()
            && !empty($request->get('SAMLResponse'));
    }

    /**
     * @param Request $request
     *
     * @return array|mixed
     */
    public function getCredentials(Request $request)
    {
        return [
            'SAMLResponse' => $request->get('SAMLResponse'),
            'RelayState' => $request->get('RelayState'),
        ];
    }

    /**
     * @param mixed                 $credentials
     * @param UserProviderInterface $userProvider
     *
     * @return UserInterface|null
     *
     * @throws Error
     * @throws \OneLogin\Saml2\ValidationError
     */
    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        $auth = $this->getAuth();

        $requestID = $_SESSION['AuthNRequestID'] ?? null;
        $auth->processResponse($requestID);
        if (isset($requestID)) {
            unset($_SESSION['AuthNRequestID']);
        }

        $errors = $auth->getErrors();

        if (!empty($errors)) {
            throw new Error(implode(PHP_EOL, $errors));
        }

        if (!$auth->isAuthenticated()) {
            throw new AuthenticationException('Not authenticated');
        }

        if (!$userProvider instanceof SAMLUserProvider) {
            throw new \RuntimeException(sprintf('Invalid user provider: %s is not an instance of %s', \get_class($userProvider), SAMLUserProvider::class));
        }

        $username = $this->getUsername($auth);
        $displayName = $this->getDisplayName($auth);

        return $userProvider->getUser($username, $displayName, $credentials);
    }

    /**
     * @param mixed         $credentials
     * @param UserInterface $user
     *
     * @return bool
     */
    public function checkCredentials($credentials, UserInterface $user)
    {
        return true;
    }

    /**
     * @param Request                 $request
     * @param AuthenticationException $exception
     *
     * @return RedirectResponse|\Symfony\Component\HttpFoundation\Response|null
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        $request->attributes->set(Security::AUTHENTICATION_ERROR, $exception);

        return new RedirectResponse('/');
    }

    /**
     * @param Request        $request
     * @param TokenInterface $token
     * @param string         $providerKey
     *
     * @return RedirectResponse|\Symfony\Component\HttpFoundation\Response|null
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, $providerKey)
    {
        // @TODO: Redirect to originally requested url.
        return new RedirectResponse('/');
    }

    /**
     * @return bool
     */
    public function supportsRememberMe()
    {
        return false;
    }

    /**
     * @return Auth
     *
     * @throws Error
     */
    public function getAuth()
    {
        return new Auth($this->getSettings());
    }

    /**
     * @param string $payload
     *
     * @return Response
     *
     * @throws Error
     * @throws \OneLogin\Saml2\ValidationError
     */
    public function getResponse(string $payload)
    {
        return new Response(new Settings($this->getSettings()), $payload);
    }

    /**
     * @return array
     *
     * @throws \Exception
     */
    public function getSettings()
    {
        if (isset($this->settings['idp']) && \is_string($this->settings['idp'])) {
            if (file_exists($this->settings['idp'])) {
                $data = IdPMetadataParser::parseFileXML($this->settings['idp']);
                if (isset($data['idp'])) {
                    $this->settings['idp'] = $data['idp'];
                }
            }
        }

        return $this->settings;
    }

    /**
     * @return bool
     */
    public function supportsSingleLogout()
    {
        return false;
    }

    /**
     * @param $samlResponse
     *
     * @return array
     *
     * @throws Error
     * @throws \OneLogin\Saml2\ValidationError
     */
    public function getRoles($samlResponse)
    {
        $roles = [];

        $settings = $this->getSettings();
        $response = new Response(new Settings($settings), $samlResponse);
        $attributes = $response->getAttributes();

        if (isset($settings['user_roles'])) {
            $userRoles = $settings['user_roles'];
            $attribute = $userRoles['attribute'] ?? 'http://schemas.xmlsoap.org/claims/Group';

            $samlRoles = $this->getSAMLRoles($attributes, $attribute);
            $rolesMap = $this->getRolesMap($userRoles);

            if (isset($rolesMap['CN'])) {
                $rolesMap = $rolesMap['CN'];
            }

            foreach ($samlRoles as $role) {
                if (isset($rolesMap[$role])) {
                    $roles[] = (array) $rolesMap[$role];
                }
            }
        }

        // Flatten the roles and make unique.
        if (!empty($roles)) {
            $roles = array_values(array_unique(array_merge(...$roles)));
        }

        return $roles;
    }

    /**
     * @param Auth $auth
     *
     * @return mixed|string
     */
    private function getUsername(Auth $auth)
    {
        if (isset($this->settings['username_attribute_name'])) {
            $attribute = $auth->getAttribute($this->settings['username_attribute_name']);
            if (!empty($attribute)) {
                $username = reset($attribute);
                if (!empty($username)) {
                    return $username;
                }
            }
        }

        // Fallback.
        return $auth->getNameId();
    }

    /**
     * Returns the name of the user for displaying purposes.
     *
     * @param Auth $auth
     *
     * @return string
     */
    private function getDisplayName(Auth $auth): string
    {
        if (isset($this->settings['display_name_attribute_name'])) {
            $attribute = $auth->getAttribute($this->settings['display_name_attribute_name']);
            if (!empty($attribute)) {
                $displayName = reset($attribute);
                if (!empty($displayName)) {
                    return $displayName;
                }
            }
        }

        return '';
    }

    /**
     * @param array  $attributes
     * @param string $attributeName
     *
     * @return array|mixed
     */
    private function getSAMLRoles(array $attributes, string $attributeName)
    {
        return $attributes[$attributeName] ?? [];
    }

    /**
     * @param $settings
     *
     * @return array
     */
    private function getRolesMap($settings)
    {
        $map = [];

        if (isset($settings['fields']) && \is_array($settings['fields'])) {
            foreach ($settings['fields'] as $name => $value) {
                $map[$name] = $value;
            }
        }

        return $map;
    }
}
