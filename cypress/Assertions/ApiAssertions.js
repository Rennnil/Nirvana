class ApiAssertions {
    static verifyStatus(interception, expectedStatus) {
        expect(interception.response.statusCode, "response status code").to.eq(expectedStatus);
    }

    static verifyResponseHasProperty(interception, property, expectedValue = undefined) {
        const message = `response body should have property "${property}"`;
        if (expectedValue !== undefined) {
            expect(interception.response.body, message).to.have.property(property, expectedValue);
        } else {
            expect(interception.response.body, message).to.have.property(property);
        }
    }

    static verifyRequestHasProperty(interception, property, expectedValue = undefined) {
        const message = `request body should have property "${property}"`;
        if (expectedValue !== undefined) {
            expect(interception.request.body, message).to.have.property(property, expectedValue);
        } else {
            expect(interception.request.body, message).to.have.property(property);
        }
    }

    static verifyApplicationIdMatches(interception, expectedApplicationId) {
        this.verifyResponseHasProperty(interception, "applicationID", expectedApplicationId);
    }

    /**
     * Verify the request body is an array of an exact expected length.
     * Used for batch-style payloads (e.g. an array of VINs sent together).
     */
    static verifyRequestBodyIsArrayOfLength(interception, expectedLength) {
        expect(interception.request.body, "request body should be an array").to.be.an("array");
        expect(
            interception.request.body.length,
            `request body array should have length ${expectedLength}`
        ).to.eq(expectedLength);
    }

    /**
     * Verify the response body is an array of an exact expected length.
     */
    static verifyResponseBodyIsArrayOfLength(interception, expectedLength) {
        expect(interception.response.body, "response body should be an array").to.be.an("array");
        expect(
            interception.response.body.length,
            `response body array should have length ${expectedLength}`
        ).to.eq(expectedLength);
    }

    /**
     * Verify a nested property inside the response body (e.g. response.body.email.to[0].email).
     * Pass a getter function so any nested path can be checked without new methods per shape.
     */
    static verifyResponseNestedProperty(interception, getter, property, expectedValue) {
        const nested = getter(interception.response.body);
        expect(nested, `nested response value should have property "${property}"`).to.have.property(
            property,
            expectedValue
        );
    }

    /**
     * Verify a nested property inside the request body.
     */
    static verifyRequestNestedProperty(interception, getter, property, expectedValue) {
        const nested = getter(interception.request.body);
        expect(nested, `nested request value should have property "${property}"`).to.have.property(
            property,
            expectedValue
        );
    }

    /**
     * Verify the response body contains a substring at a given property
     * (e.g. a generated link containing an expected path fragment).
     */
    static verifyResponsePropertyIncludes(interception, property, expectedSubstring) {
        expect(
            interception.response.body[property],
            `response property "${property}" should include "${expectedSubstring}"`
        ).to.include(expectedSubstring);
    }

    static verifyEachResponseArrayItemHasProperty(interception, property, expectedValue = undefined) {
        interception.response.body.forEach((item, index) => {
            const message = `response body item at index ${index} should have property "${property}"`;
            if (expectedValue !== undefined) {
                expect(item, message).to.have.property(property, expectedValue);
            } else {
                expect(item, message).to.have.property(property);
            }
        });
    }
}

export default ApiAssertions;