<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<!-- SET BASE URL HERE -->
<xsl:variable name="baseurl" select="'https://bng44270.github.io'" />
<!-- EDIT NOTHING BELOW HERE -->
<xsl:param name="qs-sitemap" />
<xsl:output />
<xsl:template match="/">
<html>
<head>
  <title><xsl:value-of select="site/title" /></title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous"/>
    <script type="text/javascript" src="assets/js/jquery-3.1.1.min.js"></script>
    <script type="text/javascript"><![CDATA[
      $(document).ready(function() {
        $('article.page').hide();

        $('.navitem').click(function() {
          $('article.homepage').hide();
          $('article.page').hide();
          $("article#" + $(this).attr('id')).fadeIn();
          $(document).prop('title',$(this).text());
          $('html').animate({scrollTop:0},'fast');
        });

        $('.homenav').click(function() {
          $('article.page').hide();
          $('article.homepage').fadeIn();
          $(document).prop('title',$('div.hptitle').text());
          $('html').animate({scrollTop:0},'fast');
        });

        if (location.hash == "") {
          $('a#homepage').click();
        }
        else {
          $('a' + (location.hash)).click();
        }

        var skipRepos = ['pyver','tubestream','bng44270.github.io','advanced-js-k2020','knowledge_2019_loaner_request','snWebCli','snWebCli-Additions','devtraining-needit-newyork'];

        $.get('https://api.github.com/users/bng44270/repos',function(repoData) {
	    $('#codelist').append(repoData.filter(thisRepo => {
		    return skipRepos.indexOf(thisRepo['name']) == -1;
	    }).map(thisRepo => {
			var repoLang = (thisRepo['language']) ? thisRepo['language'] : '';
     		return ('<div class="gitlink"><a href="' + thisRepo['html_url'] + '" target="_blank">' + thisRepo['description'] + ' (' + thisRepo['name'] + ' - ' + repoLang + ')</a></div>');
   		}).join(''));
    });

	$.get('https://api.github.com/users/bng44270/gists',(gistData,status,xhr) => {
		$('codelist').append(gistData.map(thisGist => {
			return '<div class="gitlink"><a target="_blank" href="' + thisGist.html_url + '">'  + thisGist.description + ' (' + thisGist.files[Object.keys(thisGist.files)[0]].filename + ')</a></div>';
  		}).join(''));
	
		xhr.getResponseHeader('link').split(',').forEach(thisLink => {
			var link = thisLink.replace(/^[ \t]*<([^>]+)>.*$/,"$1");
			$.get(link,newGistData => {	
				$('#codelist').append(newGistData.map(thisGist => {
					return '<div class="gitlink"><a target="_blank" href="' + thisGist.html_url + '">'  + thisGist.description + ' (' + thisGist.files[Object.keys(thisGist.files)[0]].filename + ')</a></div>';
		  		}).join(''));
			});
		});
	});

	$('#gitsearch').keyup(function() {
		if ($('#gitsearch').val().length == 0) $('.gitlink').show();
		else {
			$('.gitlink').hide();
			$('.gitlink').find('a').filter(function() {
				return (new RegExp($('#gitsearch').val(),'i')).test($(this).text())
			}).parent().show();
		}
	});

	$('#gitsearch').focus();


      });
    ]]></script>
    <style>
      div.container {
        border-radius: 25px;
        width: 90%;
        border: 1px solid gray;
        margin: auto;
      }

      div header {
        border-top-left-radius: 25px;
        border-top-right-radius: 25px;
      }

      div footer {
        border-bottom-left-radius: 25px;
        border-bottom-right-radius: 25px;
      }

      div header, div footer {
        padding: 1em;
        color: white;
        background-color: <xsl:for-each select="site">
            <xsl:choose>
              <xsl:when test="theme='blue'">#0000dd</xsl:when>
              <xsl:when test="theme='green'">#00cc00</xsl:when>
              <xsl:when test="theme='red'">#dd0000</xsl:when>
              <xsl:when test="theme='purple'">#800080</xsl:when>
              <xsl:when test="theme='gray'">#666666</xsl:when>
              <xsl:otherwise><xsl:value-of select="theme" /></xsl:otherwise>
            </xsl:choose>
          </xsl:for-each>;
          clear: left;
        text-align: center;
      }

      div.hptitle {
        display: none;
      }

      footer a {
        color: white;
        text-decoration: none;
      }

      footer span {
        display: inline-block;
        width: 20px;
      }

      footer p {
        font-size: 10pt;
      }

      belowpage {
        padding-top: 30px;
        display: flex;
        margin:auto;
        width: 300px;
      }

      belowpage div {
        text-align: center;
        width: 100px;
      }

      belowpage div a {
        text-decoration: none;
        color: #000000;
      }

      belowpage div.left {
        float: left;
      }

      belowpage div.right {
        float: right;
      }

      nav {
        text-align:center;
      }

      nav ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        overflow: hidden;
        background-color: <xsl:for-each select="site">
            <xsl:choose>
              <xsl:when test="theme='blue'">#0000dd</xsl:when>
              <xsl:when test="theme='green'">#00cc00</xsl:when>
              <xsl:when test="theme='red'">#dd0000</xsl:when>
              <xsl:when test="theme='purple'">#800080</xsl:when>
              <xsl:when test="theme='gray'">#666666</xsl:when>
              <xsl:otherwise><xsl:value-of select="theme" /></xsl:otherwise>
            </xsl:choose>
          </xsl:for-each>;
      }

      nav ul li {
        float:left;
      }

      nav ul li a {
        display: block;
        color: white;
        text-align: center;
        padding: 14px 16px;
        text-decoration: none;
      }

      nav ul li a:hover {
        background-color: <xsl:for-each select="site">
          <xsl:choose>
            <xsl:when test="theme='blue'">#8888dd</xsl:when>
            <xsl:when test="theme='green'">#88cc88</xsl:when>
            <xsl:when test="theme='red'">#dd8888</xsl:when>
            <xsl:when test="theme='purple'">#9370DB</xsl:when>
            <xsl:when test="theme='gray'">#999999</xsl:when>
            <xsl:otherwise><xsl:value-of select="theme" /></xsl:otherwise>
          </xsl:choose>
        </xsl:for-each>;
      }

      nav ul a {
        color: #000000;
        text-decoration: none;
      }

      nav ul a:hover {
        color: #ffffff;
      }

      content {
        float: left;
        left: 190px;
        border-left: 0px solid gray;
        padding: 1em;
        overflow: hidden;
        width:95%;
      }

      article {
        display: none;
      }

      iframe {
        border-width: 0px;
      }

      section div.image-right {
        float: right;
      }

      section div.image-left {
        float: left;
      }
 
      form div {
        top:20px;
      }

      form div span.fieldlabel {
        left:0px;
        top:0px;
      }

      form div input {
        display:block;
        position:relative;
        left:0px;
        top:0px;
      }

      form div textarea {
        display:block;
        position:relative;
        left:0px;
	top:0px;
      }

      form div select {
        display:block;
        position:relative;
        left:0px;
        top:0px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <header>
        <h1 id="pageheader"><xsl:value-of select="site/header" /></h1>
      </header>
      <nav>
        <ul>
          <li><a href="#homepage" id="homepage" class="homenav">Home</a></li>
          <xsl:for-each select="site/page">
            <li><a>
              <xsl:attribute name="href">
                <xsl:value-of select="concat('#',label)"/>
              </xsl:attribute>
              <xsl:attribute name="id">
                <xsl:value-of select="label"/>
              </xsl:attribute>
              <xsl:attribute name="class">navitem</xsl:attribute>
              <xsl:value-of select="title" />
            </a></li>
          </xsl:for-each>
        </ul>
        <xsl:for-each select="site/subpage">
          <a>
            <xsl:attribute name="href">
              <xsl:value-of select="concat('#',label)"/>
            </xsl:attribute>
            <xsl:attribute name="style">display:none;</xsl:attribute>
            <xsl:attribute name="id">
              <xsl:value-of select="label"/>
            </xsl:attribute>
            <xsl:attribute name="class">navitem</xsl:attribute>
            <xsl:value-of select="title" />
          </a>
        </xsl:for-each>
      </nav>
      <content>
        <xsl:for-each select="site/homepage">
          <article>
            <xsl:attribute name="class">homepage</xsl:attribute>
            <xsl:copy-of select="section" />
          </article>
        </xsl:for-each>
        <xsl:for-each select="site/page">
          <article>
            <xsl:attribute name="class">page</xsl:attribute>
            <xsl:attribute name="id"><xsl:value-of select="label" /></xsl:attribute>
            <xsl:copy-of select="section" />
          </article>
        </xsl:for-each>
        <xsl:for-each select="site/subpage">
          <article>
            <xsl:attribute name="class">page</xsl:attribute>
            <xsl:attribute name="id"><xsl:value-of select="label" /></xsl:attribute>
            <xsl:copy-of select="section" />
          </article>
        </xsl:for-each>
      </content>
      <xsl:copy-of select="site/footer" />
    </div>
    <div class="hptitle"><xsl:value-of select="site/title" /></div>
    <xsl:copy-of select="site/belowpage" />
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
         m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-50366970-3', 'auto');
      ga('send', 'pageview');

    </script>
  </body>
</html>
</xsl:template>
</xsl:stylesheet>
