package kz.aitu.nca.controllers;

import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.Security;
import java.security.SignatureException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertStoreException;
import java.security.cert.CertificateEncodingException;
import java.security.cert.CertificateExpiredException;
import java.security.cert.CertificateNotYetValidException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import com.fasterxml.jackson.databind.introspect.AccessorNamingStrategy.Provider;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import kz.aitu.nca.models.SignModel;
import kz.aitu.nca.services.CMSService;
import kz.gov.pki.kalkan.jce.provider.KalkanProvider;
import kz.gov.pki.kalkan.jce.provider.cms.CMSException;
import kz.gov.pki.kalkan.jce.provider.cms.CMSProcessable;
import kz.gov.pki.kalkan.jce.provider.cms.CMSSignedData;
import kz.gov.pki.kalkan.jce.provider.cms.CMSSignedDataGenerator;
import kz.gov.pki.kalkan.jce.provider.cms.SignerInformationStore;

@RestController
public class CmsController {

  @PostMapping("sign")
  @ResponseBody
  public String sign(
      @RequestBody SignModel signData
      ) throws UnrecoverableKeyException, InvalidKeyException, KeyStoreException, SignatureException, CertificateEncodingException {
    try {
      KalkanProvider provider = new KalkanProvider();
      Security.addProvider(provider);
      char[] password = "123456".toCharArray();
      byte[] data = Base64.getDecoder().decode(signData.data);
      CMSService simpleCms = new CMSService("./cert/RSA256_68c6bc6b81b7f97a794754ce9f57d195dda4a42d.p12", password, provider);
      // CMSSignedData cms = simpleCms.createCAdES(data);
      // byte[] signedData = cms.getEncoded();
      // String b64signedData = Base64.getEncoder().encodeToString(signedData);
      // System.out.println(b64signedData);

      // System.out.println("==============================================");
      // System.out.println("==============================================");
      // System.out.println("==============================================");
      // System.out.println("==============================================");
      // System.out.println("==============================================");

      String result = simpleCms.sign(data);
      return "{ \"cms:\"" + result + "}";
    } catch (NoSuchAlgorithmException | InvalidAlgorithmParameterException
        | CertStoreException | NoSuchProviderException | CMSException | IOException e) {
      e.printStackTrace();
      return "Error";
    }
  }


  @PostMapping("verify")
  public void verify() {
  }


  @PostMapping("extract")
  public void extract() {
  }

}
