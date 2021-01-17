Feature: Test online calculator scenarios
Scenario Outline: Test addition, subtraction, and division functionalities
Given Open chrome browser and start application
When I enter following values and press the = button
			|value1 | <value1>|
			|value2 | <value2>|
			|operator | <operator>|
Then I should be able to see
            |	expected |<expected>|
Examples:
		| value1  		| value2 		| operator		| expected		|
    	| 	999999999 	|   -999999999	|		+		| 0		        |
        | 	-999999999 	|   999999999	|		+		| 0		        |
        | 	999999999 	|   999999999	|		+		| 2e+9		    |
        | 	-999999999 	|   -999999999	|		+		| -2e+9		    |
        | 	999999999 	|   -999999999	|		-		| 2e+9		    |
        | 	-999999999 	|   999999999	|		-		| -2e+9		    |
        | 	-999999999 	|   -999999999	|		-		| 0		        |
        | 	999999999 	|   999999999	|		-		| 0		        |
        | 	1 	        |   0.99999999	|		-		| 1e-8		    |
        | 	    23    	|        0    	|		/		| Error		    |
        | 	    0    	|        7    	|		/		| 0		        |
        | 	    -22    	|        3    	|		/		| -7.33333333	|