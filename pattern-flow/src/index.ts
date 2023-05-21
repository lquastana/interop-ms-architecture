import { MLLPConsumer } from './mllp.eip'

const mllpConsumer = new MLLPConsumer("test",{})

mllpConsumer.start()
mllpConsumer.subscribe()