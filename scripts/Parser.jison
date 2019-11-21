%lex
%%
(\s+) /*Whitespaces*/
("declara")\b  	 return 'INTDCL' 
("dibuja")\b	return 'DRAW'
("circulo"|"cuadrado"|"estrella"|"triangulo"|"esfera")\b	return 'FIGURE'
("imprime"|"escribe")\b   return 'PRINT'
("si")\b     return 'IF'
("entonces")\b      return 'THEN'
("de lo contrario")\b     return 'ELSE'
("fin")\b     return 'FI'
[a-e]|[g-h]|[j-o]|[q-z]\b 	  return 'ID'
[A-Z\s]+\b        return 'STRING' 
("=")  return 'ASSIGN'  
("igual")\b  return 'COMPARATOR'
("+") 	 return 'PLUS' 
("-") 	 return 'MINUS' 
("*")    return 'TIMES'
("^")    return 'POWER' 
("/")    return 'DIVIDE'
("!")    return 'FACTORIAL'
("(")    return 'OPPARENTHESIS'
(")")    return 'CLPARENTHESIS'
(",")  return 'COMMA' 
("PI")   return 'PI'
(";")	 return 'ENDOFSTMT' 
[0-9]+ return 'INUM' 
.	return 'INVALID'
(\n)	return 'LINE'
/lex

%left PLUS MINUS
%left TIMES DIVIDE
%left POWER
%right FACTORIAL
%left UMINUS

%start prog

%ebnf

%options token-stack

%%

prog: dcls stmts
	;
dcls: dcl dcls
	|
	;
dcl: INTDCL ID ENDOFSTMT  { symtable[$2] = 0; } 
	;
stmts: stmt stmts 
        |
        ;
stmt: ID ASSIGN expr ENDOFSTMT { symtable[$1] = $3; }
        | PRINT ID ENDOFSTMT {terminal.print(symtable[$2]); }
        | PRINT STRING ENDOFSTMT {terminal.print($2);}
	| DRAW FIGURE OPPARENTHESIS figures CLPARENTHESIS ENDOFSTMT {
                if($2 == 'cuadrado'){canvas.addFigure(Canvas.SQUARE, $4);}
                if($2 == 'triangulo'){canvas.addFigure(Canvas.TRIANGLE, $4);} 
                if($2 == 'circulo'){canvas.addFigure(Canvas.CIRCLE, $4);}  
                if($2 == 'esfera'){canvas.addPolygon('Esfera', $4);}  
                }
        | ifstmt {$$ = $1;}
        ;
figures: expr {$$ = $1;}
        ;

ifstmt: IF compare THEN stmt ELSE stmt FI ENDOFSTMT {{
          $$ = (function ifstmt (eval, stmt1, stmt2) { return eval ? stmt1 : stmt2 })($2, $4, $6);
        }}
        | IF compare THEN stmt FI ENDOFSTMT {{
          $$ = (function ifstmt (eval, stmt1) { return eval ? stmt1 : 1 })($2, $4);
        }}
        ;
expr:   expr PLUS expr { $$=$1+$3; }
        | expr MINUS expr { $$=$1-$3; }
        | MINUS expr %prec UMINUS {$$ = -$2;}
        | expr TIMES expr { $$=$1*$3; }
        | expr DIVIDE expr { $$ =$1/$3; }
        | expr POWER expr { $$ = Math.pow($1, $3);}
        | expr FACTORIAL {{
          $$ = (function fact (n) { return n==0 ? 1 : fact(n-1) * n })($1);
        }}
        | OPPARENTHESIS expr CLPARENTHESIS {$$ = $2;}
        | PI {$$=Math.PI;}
        | ID { $$ = symtable[$1]; } 
        | INUM { $$ = Number(yytext); }
        | STRING { $$ = yytext;} 
        ;
compare: expr COMPARATOR expr {$$ = $1 == $3;}
        ;
%%

symtable = []
let terminal;
terminal = new Terminal(document.getElementById("terminal"));
