<?php

namespace App\Controller\Admin;

use App\Entity\BoxConfiguration;
use App\Utils\Types\LanguageCodes;
use App\Utils\Types\LoginMethods;
use EasyCorp\Bundle\EasyAdminBundle\Config\Filters;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\FormField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/**
 * Class BoxConfigurationCrudController.
 */
class BoxConfigurationCrudController extends AbstractCrudController
{
    private UrlGeneratorInterface $router;

    /**
     * BoxConfigurationCrudController constructor.
     *
     * @param UrlGeneratorInterface $router
     *   Url generator
     */
    public function __construct(UrlGeneratorInterface $router)
    {
        $this->router = $router;
    }

    /**
     * Get entity fqcn.
     *
     * @return string
     */
    public static function getEntityFqcn(): string
    {
        return BoxConfiguration::class;
    }

    /**
     * Configure fields.
     *
     * @param string $pageName
     *
     * @return iterable
     */
    public function configureFields(string $pageName): iterable
    {
        return [
            FormField::addPanel('Details'),
            IdField::new('id')->hideOnForm()->hideOnIndex(),
            TextField::new('name'),
            AssociationField::new('school'),
            AssociationField::new('sip2User'),
            TextField::new('uniqueId')
                ->setLabel('Identifier')
                ->setFormTypeOption('disabled', 'disabled')
                // This only applies to index and detail pages.
                ->formatValue(function ($value) {
                    return $this->router->generate('frontend_load', ['uniqueId' => $value], UrlGeneratorInterface::ABSOLUTE_URL);
                }),

            FormField::addPanel('Options'),
            BooleanField::new('hasTouch')->hideOnIndex(),
            BooleanField::new('hasKeyboard')->hideOnIndex(),
            BooleanField::new('hasPrinter')->hideOnIndex(),
            BooleanField::new('soundEnabled')->hideOnIndex(),
            BooleanField::new('debugEnabled'),
            BooleanField::new('hasFrontpageCheckIn')
                ->setHelp('Scanning an item on the frontpage will result in a check-in of the material.')
                ->hideOnIndex(),
            IntegerField::new('inactivityTimeOut')->hideOnIndex(),
            TextField::new('reservedMaterialInstruction'),
            ChoiceField::new('defaultLanguageCode')
                ->setChoices(array_flip(LanguageCodes::getLanguageCodeList()))
                ->hideOnIndex(),

            FormField::addPanel('Login'),
            ChoiceField::new('loginMethod')
                ->setHelp('Standard login option')
                ->setChoices(LoginMethods::getLoginMethodList())
                ->hideOnIndex(),
            TextField::new('defaultPassword')->hideOnIndex(),
            BooleanField::new('loginSessionEnabled')
                ->setHelp('Enables option to start login sessions where the default login is replaced by another login method.')
                ->hideOnIndex(),
            IntegerField::new('loginSessionTimeout')
                ->setHelp('Time (in seconds) before reverting to default login method.')
                ->hideOnIndex(),
            ChoiceField::new('loginSessionMethods')
                ->setHelp('The login method options when starting a login session.')
                ->setChoices(LoginMethods::getLoginMethodList())
                ->allowMultipleChoices(true)
                ->hideOnIndex(),
        ];
    }

    /**
     * Configure filters.
     *
     * @param Filters $filters
     *
     * @return Filters
     */
    public function configureFilters(Filters $filters): Filters
    {
        return $filters
            ->add('name')
            ->add('school')
            ->add('sip2User');
    }
}
