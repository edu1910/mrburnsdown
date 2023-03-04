import { db } from '../utils/firebase'
import { ref, set, get } from 'firebase/database'
import { v4 as uuidv4 } from 'uuid'

class BurndownProvider {
  async getByKey(key) {
    let result = await get(ref(db, `burndowns/${key}`))
    if (result.exists()) {
      return result.val()
    }

    return null
  }

  async create(burndown) {
    let key = uuidv4()

    let result = await get(ref(db, `burndowns/${key}`))
    while (result.exists()) {
      key = uuidv4()
      result = await get(ref(db, `burndowns/${key}`))
    }
    await set(ref(db, `burndowns/${key}`), burndown)
    return key
  }

  async update(key, burndown) {
    await set(ref(db, `burndowns/${key}`), burndown)
  }
}

const provider = new BurndownProvider()

export default provider
