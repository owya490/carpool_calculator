package com.myorg;

import software.constructs.Construct;
import software.amazon.awscdk.AssetOptions;
import software.amazon.awscdk.Duration;
import software.amazon.awscdk.Stack;
import software.amazon.awscdk.StackProps;
import software.amazon.awscdk.services.apigateway.LambdaRestApi;
import software.amazon.awscdk.services.lambda.Code;
// import software.amazon.awscdk.Duration;
// import software.amazon.awscdk.services.sqs.Queue;
import software.amazon.awscdk.services.lambda.Function;
import software.amazon.awscdk.services.lambda.FunctionProps;
import software.amazon.awscdk.services.lambda.Runtime;

public class AwsBackendStack extends Stack {
    public AwsBackendStack(final Construct scope, final String id) {
        this(scope, id, null);
    }

    public AwsBackendStack(final Construct scope, final String id, final StackProps props) {
        super(scope, id, props);

        // The code that defines your stack goes here

        // example resource
        // final Queue queue = Queue.Builder.create(this, "AwsBackendQueue")
        //         .visibilityTimeout(Duration.seconds(300))
        //         .build();

        Function carpoolFunction = new Function(this, "carpoolFunction", FunctionProps.builder()
        .runtime(Runtime.PYTHON_3_9)
        .code(Code.fromAsset("./resources/"))
        .handler("carpoolHandler.calculator")
        .memorySize(1024)
        .timeout(Duration.seconds(300))
        .build());

        LambdaRestApi.Builder.create(this, "carpoolEndpoint")
        .handler(carpoolFunction)
        .build();
    }
}
