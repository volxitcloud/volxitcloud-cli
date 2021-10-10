#!/usr/bin/env node

import StdOutUtil from '../utils/StdOutUtil'
import Constants from '../utils/Constants'
import Utils from '../utils/Utils'
import CliHelper from '../utils/CliHelper'
import {
    getErrorForDomain,
    getErrorForPassword,
    getErrorForMachineName
} from '../utils/ValidationsHandler'
import Command, { IOption, IParams, ICommandLineOptions } from './Command'

const K = Utils.extendCommonKeys({
    https: 'hasRootHttps'
})

export default class Login extends Command {
    protected command = 'login'

    protected description =
        'Login to a VolxitCloud machine. You can be logged in to multiple machines simultaneously.'

    protected options = (params?: IParams): IOption[] => [
        this.getDefaultConfigFileOption(),
        {
            name: K.https, // Backward compatibility with config hasRootHttps parameter, eventually to remove when releasing v2
            hide: true,
            when: false
        },
        {
            name: K.url,
            char: 'u',
            env: 'VOLXITCLOUD_URL',
            type: 'input',
            message: `VolxitCloud machine URL address, it is "[http[s]://][${Constants.ADMIN_DOMAIN}.]your-volxit-root.domain"`,
            default: params && Constants.SAMPLE_DOMAIN,
            filter: (url: string) =>
                Utils.cleanAdminDomainUrl(
                    url,
                    this.paramValue(params, K.https)
                ) || url, // If not cleaned url, leave url to fail validation with correct error
            validate: (url: string) => getErrorForDomain(url)
        },
        {
            name: K.pwd,
            char: 'p',
            env: 'VOLXITCLOUD_PASSWORD',
            type: 'password',
            message: 'VolxitCloud machine password',
            validate: (password: string) => getErrorForPassword(password)
        },
        {
            name: K.name,
            char: 'n',
            env: 'VOLXITCLOUD_NAME',
            type: 'input',
            message:
                'VolxitCloud machine name, with whom the login credentials are stored locally',
            default: params && CliHelper.get().findDefaultVolxitName(),
            filter: (name: string) => name.trim(),
            validate: (name: string) => getErrorForMachineName(name)
        }
    ]

    protected async preAction(
        cmdLineoptions: ICommandLineOptions
    ): Promise<ICommandLineOptions> {
        StdOutUtil.printMessage('Login to a VolxitCloud machine...\n')
        return Promise.resolve(cmdLineoptions)
    }

    protected async action(params: IParams): Promise<void> {
        CliHelper.get().loginMachine(
            {
                authToken: '',
                baseUrl: this.findParamValue(params, K.url)!.value,
                name: this.findParamValue(params, K.name)!.value
            },
            this.findParamValue(params, K.pwd)!.value
        )
    }
}
