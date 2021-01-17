Feature: Test online calculator scenarios
Scenario Outline: Test addition, subtraction, and division functionalities
Given Open chrome browser and start application
When I enter following values and press the = button
			| value1 	| <value1>	 |
			| value2 	| <value2>	 |
			| operator 	| <operator> |
Then I should be able to see
            | expected 	| <expected> |
Examples:
		| value1  		| value2 		|  	operator	| expected		|
    	| 	999999999 	|   999999999	|		+		| 2e+9		    |
        | 	-999999999 	|   -999999999	|		+		| -2e+9		    |
		| 	45 			|   -45			|		+		| 0		        |
        | 	-1775.75 	|   985.008		|		+		| -790.742      |
		|	78459865590	|	3209		|		+		| 784601864		|
        | 	999999999 	|   -999999999	|		-		| 2e+9		    |
        | 	-999999999 	|   999999999	|		-		| -2e+9		    |
        | 	-600000 	|   -98.325		|		-		| -599901.675   |
        | 	750000 		|   0.004998	|		-		| 749999.994	|
        | 	1 	        |   0.99999999	|		-		| 1e-8		    |
        | 	23    		|   0    		|		/		| Error		    |
        | 	0    		|	7    		|		/		| 0		        |
        | 	-22    		|   3    		|		/		| -7.33333333	|
		|	2268		|	-42			|		/		| -54			|
		|	-96000		|	-65.5		|		/		| 1465.64885	|
		|	999999999	|	0.00000001	|		/		| 10e+16		|
		|	0.00000001	|	999999999	|		/		| 1e-17			|

# Test Cases Considered:
# - Boundary values
# - Integers (Negative and Positive) and Decimal Values
# - Mathematical Limitations (Errors)
# - Input limitation handling (Only first 9 digits input are considered)
# - Rounded up values
