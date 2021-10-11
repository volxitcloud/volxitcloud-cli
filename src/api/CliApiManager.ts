import Constants from '../utils/Constants'
import StorageHelper from '../utils/StorageHelper'
import { IHashMapGeneric } from '../models/IHashMapGeneric'
import { IMachine } from '../models/storage/StoredObjects'
import ApiManager from './ApiManager'

function hashCode(str: string) {
    let hash = 0
    let i
    let chr
    if (str.length === 0) {
        return hash
    }
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i)
        hash = (hash << 5) - hash + chr
        hash |= 0 // Convert to 32bit integer
    }
    return hash
}

export default class CliApiManager {
    static instances: IHashMapGeneric<ApiManager> = {}

    static get(volxMachine: IMachine) {
        const hashKey = 'v' + hashCode(volxMachine.baseUrl)
        if (!CliApiManager.instances[hashKey]) {
            CliApiManager.instances[hashKey] = new ApiManager(
                volxMachine.baseUrl + Constants.BASE_API_PATH,
                volxMachine.appToken,
                function(token) {
                    volxMachine.authToken = token
                    if (volxMachine.name) {
                        StorageHelper.get().saveMachine(volxMachine)
                    }
                    return Promise.resolve()
                }
            )
        }

        CliApiManager.instances[hashKey].setAuthToken(volxMachine.authToken)

        return CliApiManager.instances[hashKey]
    }
}
