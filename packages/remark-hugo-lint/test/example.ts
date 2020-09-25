import { suite, test } from '@testdeck/mocha'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

// tslint:disable: no-unused-expression

chai.use(chaiAsPromised)
const { expect } = chai

@suite
export class ExampleUnitTest {

    @test('should write a test here')
    public async exampleTest() {
        expect(true).to.be.true
    }
}
